<?php

namespace App\Services;

use App\Jobs\CloneRepositoryJob;
use App\Models\User;
use App\Models\Website;
use Illuminate\Validation\ValidationException;

class WebsiteService
{
    public function __construct(private readonly GithubService $github) {}

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException
     */
    public function createForUser(User $user, array $data): Website
    {
        $connection = $user->githubConnection;

        if (! $connection) {
            throw ValidationException::withMessages([
                'repository_full_name' => 'Connect your GitHub account before deploying a site.',
            ]);
        }

        // Never trust the submitted repository: confirm it is reachable with this user's own token.
        $repository = $this->github->getRepository($connection, $data['repository_full_name']);

        if ($repository === null) {
            throw ValidationException::withMessages([
                'repository_full_name' => 'We could not find that repository on your GitHub account.',
            ]);
        }

        $website = $user->websites()->create([
            'name' => $data['name'],
            'subdomain' => $data['subdomain'],
            'repository_full_name' => $repository['full_name'],
            'repository_default_branch' => $repository['default_branch'] ?? $data['repository_default_branch'],
            'repository_private' => (bool) ($repository['private'] ?? false),
            'status' => Website::STATUS_QUEUED,
        ]);

        CloneRepositoryJob::dispatch($website);

        return $website;
    }
}
