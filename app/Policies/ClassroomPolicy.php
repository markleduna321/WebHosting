<?php

namespace App\Policies;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ClassroomPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user !== null;
    }

    public function view(User $user, Classroom $classroom): bool
    {
        return $user->id === $classroom->owner_id;
    }

    public function create(User $user): bool
    {
        return $user !== null;
    }

    public function update(User $user, Classroom $classroom): bool
    {
        return $user->id === $classroom->owner_id;
    }

    public function delete(User $user, Classroom $classroom): bool
    {
        return $user->id === $classroom->owner_id;
    }
}