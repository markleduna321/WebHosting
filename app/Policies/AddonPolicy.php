<?php

namespace App\Policies;

use App\Models\Addon;
use App\Models\User;

class AddonPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Addon $addon): bool
    {
        return $user->hasRole('admin');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Addon $addon): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Addon $addon): bool
    {
        return $user->hasRole('admin');
    }
}
