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
        $root = realpath(storage_path('app/websites/'.$website->uuid));

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
            ->map(function (string $entry) use ($absolute, $prefix) {
                $full = $absolute.DIRECTORY_SEPARATOR.$entry;
                $isDirectory = is_dir($full);

                return [
                    'name' => $entry,
                    'path' => $prefix === '' ? $entry : $prefix.'/'.$entry,
                    'type' => $isDirectory ? 'folder' : 'file',
                    'size_bytes' => $isDirectory ? null : (filesize($full) ?: 0),
                    'item_count' => $isDirectory ? max(count(scandir($full) ?: []) - 2, 0) : null,
                    'updated_at' => date(DATE_ATOM, filemtime($full) ?: time()),
                ];
            })
            ->sortBy([
                fn (array $a, array $b) => ($b['type'] === 'folder') <=> ($a['type'] === 'folder'),
                fn (array $a, array $b) => strcasecmp($a['name'], $b['name']),
            ])
            ->values();
    }
}
