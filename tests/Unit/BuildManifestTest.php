<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\File;
use Tests\TestCase;

/**
 * public/build is committed, so a bad merge can ship broken assets and 500 every page.
 */
class BuildManifestTest extends TestCase
{
    private function buildPath(string $path = ''): string
    {
        return public_path('build'.($path !== '' ? '/'.$path : ''));
    }

    protected function setUp(): void
    {
        parent::setUp();

        if (! File::exists($this->buildPath('manifest.json'))) {
            $this->markTestSkipped('No frontend build present.');
        }
    }

    public function test_manifest_is_valid_json_and_references_existing_assets(): void
    {
        $manifest = json_decode(File::get($this->buildPath('manifest.json')), true);

        $this->assertIsArray($manifest, 'public/build/manifest.json is not valid JSON.');

        $missing = [];
        foreach ($manifest as $entry) {
            foreach (array_merge([$entry['file'] ?? null], $entry['css'] ?? []) as $file) {
                if ($file !== null && ! File::exists($this->buildPath($file))) {
                    $missing[] = $file;
                }
            }
        }

        $this->assertSame([], $missing, 'Manifest references missing build files.');
    }

    public function test_every_inertia_page_has_a_manifest_entry(): void
    {
        $manifest = json_decode(File::get($this->buildPath('manifest.json')), true) ?? [];

        $missing = collect(File::allFiles(resource_path('js/pages')))
            ->filter(fn ($file) => $file->getFilename() === 'page.jsx')
            ->map(fn ($file) => 'resources/js/pages/'.str_replace('\\', '/', $file->getRelativePathname()))
            ->reject(fn (string $page) => array_key_exists($page, $manifest))
            ->values()
            ->all();

        $this->assertSame([], $missing, 'Pages missing from the build; run npm run build.');
    }

    public function test_build_files_contain_no_merge_conflict_markers(): void
    {
        $conflicted = collect(File::allFiles($this->buildPath()))
            ->filter(fn ($file) => preg_match('/^(<{7} |>{7} )/m', $file->getContents()) === 1)
            ->map(fn ($file) => str_replace('\\', '/', $file->getRelativePathname()))
            ->values()
            ->all();

        $this->assertSame([], $conflicted, 'Build files contain git conflict markers.');
    }
}
