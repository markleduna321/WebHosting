<?php

namespace App\Policies;

use App\Models\GithubConnection;
use App\Models\User;

class GithubConnectionPolicy
{
    public function view(User $user, GithubConnection $connection): bool
    {
        return $user->id === $connection->user_id;
    }

    public function delete(User $user, GithubConnection $connection): bool
    {
        return $user->id === $connection->user_id;
    }
}
