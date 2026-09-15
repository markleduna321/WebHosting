<?php

namespace App\Policies;

use App\Models\StudentDatabase;
use App\Models\User;

class StudentDatabasePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, StudentDatabase $database): bool
    {
        return $user->id === $database->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, StudentDatabase $database): bool
    {
        return $user->id === $database->user_id;
    }

    public function delete(User $user, StudentDatabase $database): bool
    {
        return $user->id === $database->user_id;
    }
}
