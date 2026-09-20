<?php

namespace App\Services;

use App\Models\Website;
use Illuminate\Support\Collection;
use RuntimeException;

class WebsiteFileService
{
    /**
     * Resolves a user-supplied relative path inside a website's storage root.
     *
     * This is the path-traversal boundary: the resolved path must remain inside
     * the website directory or the request is rejected.
     */
    public function resolvePath(Website $website, string $relativePath = ''): string
    {
        if (empty($website->storage_path)) {
            throw new RuntimeException('This site has no files yet.');
        }

        $root = realpath($website->storage_path);

        if ($root === false) {
            throw new RuntimeException('This site has no files yet.');
        }

        $relativePath = str_replace('\\', '/', trim($relativePath, "/ \t\n\r\0\x0B"));

        if ($relativePath === '') {
            return $root;
        }

        foreach (explode('/', $relativePath) as $segment) {
            if ($segment === '..' || $segment === '.' || $segment === '') {
                throw new RuntimeException('Invalid path.');
            }
        }

        $target = realpath($root.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relativePath));

        if ($target === false || ! str_starts_with($target, $root)) {
            throw new RuntimeException('Invalid path.');
        }

        return $target;
    }

    /**
     * Lists a single directory level, directories first.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function listDirectory(Website $website, string $relativePath = ''): Collection
    {
        $absolute = $this->resolvePath($website, $relativePath);

        if (! is_dir($absolute)) {
            throw new RuntimeException('That path is not a folder.');
        }

        $entries = scandir($absolute) ?: [];
        $prefix = trim($relativePath, '/');

        return collect($entries)
            ->reject(fn (string $entry) => $entry === '.' || $entry === '..')
            // Symlinks are never created during extraction; skip any that appear.
            ->reject(fn (string $entry) => is_link($absolute.DIRECTORY_SEPARATOR.$entry))
            ->map(fn (string $entry) => $this->describeEntry($absolute.DIRECTORY_SEPARATOR.$entry, $entry, $prefix))
            ->sortBy([
                fn (array $a, array $b) => ($b['type'] === 'folder') <=> ($a['type'] === 'folder'),
                fn (array $a, array $b) => strcasecmp($a['name'], $b['name']),
            ])
            ->values();
    }

    /**
     * Returns the raw text content of a single file.
     *
     * @throws RuntimeException
     */
    public function readFile(Website $website, string $filePath): string
    {
        $absolute = $this->resolvePath($website, $filePath);

        if (is_dir($absolute)) {
            throw new RuntimeException('That path is a folder, not a file.');
        }

        $maxBytes = (int) config('hosting.files.max_upload_bytes', 2 * 1024 * 1024);

        if (filesize($absolute) > $maxBytes) {
            throw new RuntimeException('This file is too large to edit in the browser.');
        }

        $content = file_get_contents($absolute);

        if ($content === false) {
            throw new RuntimeException('Could not read that file.');
        }

        return $content;
    }

    /**
     * Overwrites a file with new content.
     *
     * @throws RuntimeException
     */
    public function updateFile(Website $website, string $filePath, string $content): void
    {
        $absolute = $this->resolvePath($website, $filePath);

        if (is_dir($absolute)) {
            throw new RuntimeException('That path is a folder, not a file.');
        }

        if (file_put_contents($absolute, $content) === false) {
            throw new RuntimeException('Could not save that file.');
        }
    }

    /**
     * Creates a file inside the given directory with the given content.
     *
     * @return array<string, mixed>
     */
    public function createFile(Website $website, string $directory, string $name, string $content = ''): array
    {
        $absoluteDirectory = $this->resolvePath($website, $directory);

        if (! is_dir($absoluteDirectory)) {
            throw new RuntimeException('That path is not a folder.');
        }

        if (str_contains($name, '/') || str_contains($name, '\\') || $name === '.' || $name === '..') {
            throw new RuntimeException('Invalid file name.');
        }

        $target = $absoluteDirectory.DIRECTORY_SEPARATOR.$name;

        if (file_exists($target)) {
            throw new RuntimeException('A file or folder with that name already exists.');
        }

        if (file_put_contents($target, $content) === false) {
            throw new RuntimeException('Could not create that file.');
        }

        return $this->describeEntry($target, $name, trim($directory, '/'));
    }

    /**
     * @return array<string, mixed>
     */
    private function describeEntry(string $absolutePath, string $name, string $prefix): array
    {
        $isDirectory = is_dir($absolutePath);

        return [
            'name' => $name,
            'path' => $prefix === '' ? $name : $prefix.'/'.$name,
            'type' => $isDirectory ? 'folder' : 'file',
            'size_bytes' => $isDirectory ? null : (filesize($absolutePath) ?: 0),
            'item_count' => $isDirectory ? max(count(scandir($absolutePath) ?: []) - 2, 0) : null,
            'updated_at' => date(DATE_ATOM, filemtime($absolutePath) ?: time()),
        ];
    }
}
