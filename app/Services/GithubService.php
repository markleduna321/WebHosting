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
}
