<?php

namespace App\Services;

use App\Exceptions\GithubAuthorizationException;
use App\Models\GithubConnection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class GithubService
{
    private const API_URL = 'https://api.github.com';

    /**
     * @return Collection<int, array<string, mixed>>
     *
     * @throws GithubAuthorizationException
     */
    public function listRepositories(GithubConnection $connection): Collection
    {
        $response = Http::withToken($connection->access_token)
            ->withHeaders([
                'Accept' => 'application/vnd.github+json',
                'X-GitHub-Api-Version' => '2022-11-28',
            ])
            ->timeout(10)
            ->get(self::API_URL.'/user/repos', [
                'per_page' => 100,
                'sort' => 'updated',
                'affiliation' => 'owner,collaborator',
            ]);

        if ($response->status() === 401 || $response->status() === 403) {
            throw new GithubAuthorizationException();
        }

        $response->throw();

        return collect($response->json());
    }

    /**
     * Returns null when the repository does not exist or the user cannot see it.
     *
     * @return array<string, mixed>|null
     *
     * @throws GithubAuthorizationException
     */
    public function getRepository(GithubConnection $connection, string $fullName): ?array
    {
        $response = Http::withToken($connection->access_token)
            ->withHeaders([
                'Accept' => 'application/vnd.github+json',
                'X-GitHub-Api-Version' => '2022-11-28',
            ])
            ->timeout(10)
            ->get(self::API_URL.'/repos/'.$fullName);

        if ($response->status() === 401) {
            throw new GithubAuthorizationException();
        }

        if ($response->status() === 404 || $response->status() === 403) {
            return null;
        }

        $response->throw();

        return $response->json();
    }

    /**
     * Streams the repository zipball to a temporary file and returns its path.
     *
     * @throws GithubAuthorizationException
     */
    public function downloadZipball(GithubConnection $connection, string $fullName, string $ref): string
    {
        $temporaryPath = tempnam(sys_get_temp_dir(), 'repo_');

        if ($temporaryPath === false) {
            throw new \RuntimeException('Could not allocate a temporary file for the download.');
        }

        $response = Http::withToken($connection->access_token)
            ->withHeaders([
                'Accept' => 'application/vnd.github+json',
                'X-GitHub-Api-Version' => '2022-11-28',
            ])
            ->timeout(120)
            // Streamed to disk so a large repository never has to fit in memory_limit.
            ->sink($temporaryPath)
            ->get(self::API_URL."/repos/{$fullName}/zipball/{$ref}");

        if ($response->status() === 401) {
            @unlink($temporaryPath);
            throw new GithubAuthorizationException();
        }

        if (! $response->successful()) {
            @unlink($temporaryPath);
            $response->throw();
        }

        return $temporaryPath;
    }
}
