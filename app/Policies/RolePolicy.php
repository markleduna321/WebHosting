<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('role-list');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->can('role-list');
    }

    public function create(User $user): bool
    {
        return $user->can('role-create');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->can('role-edit');
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->can('role-delete');
    }
}
