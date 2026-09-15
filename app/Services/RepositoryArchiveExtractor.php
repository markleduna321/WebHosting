<?php

namespace App\Services;

use App\Exceptions\RepositoryExtractionException;
use Illuminate\Support\Str;
use ZipArchive;

/**
 * Extracts a GitHub zipball into a website directory.
 *
 * Every entry is validated before anything touches disk: this is the zip-slip
 * and zip-bomb boundary for untrusted, user-supplied repositories.
 */
class RepositoryArchiveExtractor
{
    public const MAX_TOTAL_BYTES = 209_715_200; // 200 MB uncompressed

    public const MAX_FILE_BYTES = 26_214_400;   // 25 MB per file

    public const MAX_FILES = 5_000;

    /**
     * @return array{file_count: int, size_bytes: int}
     *
     * @throws RepositoryExtractionException
     */
    public function extract(string $archivePath, string $destination): array
    {
        $zip = new ZipArchive();

        if ($zip->open($archivePath) !== true) {
            throw new RepositoryExtractionException('The downloaded archive could not be opened.');
        }

        $realDestination = $this->prepareDestination($destination);

        $fileCount = 0;
        $totalBytes = 0;

        try {
            // GitHub wraps everything in a single "owner-repo-sha/" directory.
            $rootPrefix = $this->detectRootPrefix($zip);

            for ($i = 0; $i < $zip->numFiles; $i++) {
                $stat = $zip->statIndex($i);

                if ($stat === false) {
                    continue;
                }

                $entryName = $stat['name'];
                $relative = $this->normaliseEntry($entryName, $rootPrefix);

                if ($relative === null) {
                    continue;
                }

                $isDirectory = str_ends_with($entryName, '/');
                $target = $realDestination.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);

                // Zip-slip: the resolved parent must still sit inside the destination.
                $this->assertInsideDestination($target, $realDestination);

                if ($isDirectory) {
                    if (! is_dir($target) && ! mkdir($target, 0755, true) && ! is_dir($target)) {
                        throw new RepositoryExtractionException('Could not create a directory while extracting.');
                    }

                    continue;
                }

                if ($stat['size'] > self::MAX_FILE_BYTES) {
                    throw new RepositoryExtractionException('The repository contains a file larger than 25 MB.');
                }

                $fileCount++;
                $totalBytes += $stat['size'];

                if ($fileCount > self::MAX_FILES) {
                    throw new RepositoryExtractionException('The repository contains more than 5,000 files.');
                }

                if ($totalBytes > self::MAX_TOTAL_BYTES) {
                    throw new RepositoryExtractionException('The repository is larger than the 200 MB limit.');
                }

                $this->writeFile($zip, $i, $target);
            }
        } finally {
            $zip->close();
        }

        return ['file_count' => $fileCount, 'size_bytes' => $totalBytes];
    }

    private function prepareDestination(string $destination): string
    {
        if (! is_dir($destination) && ! mkdir($destination, 0755, true) && ! is_dir($destination)) {
            throw new RepositoryExtractionException('Could not create the website storage directory.');
        }

        $real = realpath($destination);

        if ($real === false) {
            throw new RepositoryExtractionException('Could not resolve the website storage directory.');
        }

        return $real;
    }

    private function detectRootPrefix(ZipArchive $zip): string
    {
        $first = $zip->getNameIndex(0);

        if ($first === false) {
            return '';
        }

        $segment = explode('/', $first)[0] ?? '';

        return $segment === '' ? '' : $segment.'/';
    }

    /**
     * Returns the safe relative path, or null when the entry must be skipped.
     */
    private function normaliseEntry(string $entryName, string $rootPrefix): ?string
    {
        // Backslashes are never legitimate in zip entry names and are a traversal vector on Windows.
        if (str_contains($entryName, '\\')) {
            throw new RepositoryExtractionException('The archive contains an invalid entry name.');
        }

        if ($rootPrefix !== '' && str_starts_with($entryName, $rootPrefix)) {
            $entryName = substr($entryName, strlen($rootPrefix));
        }

        $entryName = ltrim($entryName, '/');

        if ($entryName === '') {
            return null;
        }

        foreach (explode('/', $entryName) as $segment) {
            if ($segment === '..' || $segment === '.') {
                throw new RepositoryExtractionException('The archive contains a path traversal entry.');
            }
        }

        if (Str::startsWith($entryName, ['/', 'C:', 'c:'])) {
            throw new RepositoryExtractionException('The archive contains an absolute path entry.');
        }

        return $entryName;
    }

    private function assertInsideDestination(string $target, string $realDestination): void
    {
        $parent = dirname($target);

        if (! is_dir($parent) && ! mkdir($parent, 0755, true) && ! is_dir($parent)) {
            throw new RepositoryExtractionException('Could not create a directory while extracting.');
        }

        $realParent = realpath($parent);

        if ($realParent === false || ! str_starts_with($realParent, $realDestination)) {
            throw new RepositoryExtractionException('The archive tried to write outside the website directory.');
        }
    }

    private function writeFile(ZipArchive $zip, int $index, string $target): void
    {
        $stream = $zip->getStreamIndex($index);

        if ($stream === false) {
            throw new RepositoryExtractionException('Could not read a file from the archive.');
        }

        $handle = fopen($target, 'wb');

        if ($handle === false) {
            fclose($stream);
            throw new RepositoryExtractionException('Could not write a file while extracting.');
        }

        stream_copy_to_stream($stream, $handle);

        fclose($handle);
        fclose($stream);
    }
}
