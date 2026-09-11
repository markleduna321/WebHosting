<?php

namespace App\Services;

use App\Models\Role;
use Illuminate\Validation\ValidationException;

class RoleService
{
    /**
     * Roles that can never be renamed, re-permissioned, or deleted.
     *
     * @var array<int, string>
     */
    public const PROTECTED_ROLES = ['admin'];

    public function create(array $data): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        return $role->load('permissions')->loadCount('users');
    }

    public function update(Role $role, array $data): Role
    {
        $this->guardProtectedRole($role, 'updated');

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        return $role->load('permissions')->loadCount('users');
    }

    public function delete(Role $role): void
    {
        $this->guardProtectedRole($role, 'deleted');

        if ($role->users()->exists()) {
            throw ValidationException::withMessages([
                'role' => 'This role is still assigned to users. Reassign them before deleting it.',
            ]);
        }

        $role->delete();
    }

    public static function isProtected(Role $role): bool
    {
        return in_array($role->name, self::PROTECTED_ROLES, true);
    }

    protected function guardProtectedRole(Role $role, string $action): void
    {
        if (self::isProtected($role)) {
            throw ValidationException::withMessages([
                'role' => "The {$role->name} role is protected and cannot be {$action}.",
            ]);
        }
    }
}
