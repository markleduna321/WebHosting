<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionService
{
    /**
     * Baseline permissions the application's own policies depend on.
     *
     * @var array<int, string>
     */
    public const PROTECTED_PERMISSIONS = [
        'user-list', 'user-create', 'user-edit', 'user-delete',
        'role-list', 'role-create', 'role-edit', 'role-delete',
        'permission-list', 'permission-create', 'permission-edit', 'permission-delete',
    ];

    public function create(array $data): Permission
    {
        $permission = Permission::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

        $this->flushCache();

        return $permission->loadCount('roles');
    }

    public function update(Permission $permission, array $data): Permission
    {
        $this->guardProtectedPermission($permission, 'renamed');

        $permission->update(['name' => $data['name']]);

        $this->flushCache();

        return $permission->loadCount('roles');
    }

    public function delete(Permission $permission): void
    {
        $this->guardProtectedPermission($permission, 'deleted');

        if ($permission->roles()->exists()) {
            throw ValidationException::withMessages([
                'permission' => 'This permission is still attached to roles. Detach it from all roles before deleting it.',
            ]);
        }

        $permission->delete();

        $this->flushCache();
    }

    public static function isProtected(Permission $permission): bool
    {
        return in_array($permission->name, self::PROTECTED_PERMISSIONS, true);
    }

    protected function guardProtectedPermission(Permission $permission, string $action): void
    {
        if (self::isProtected($permission)) {
            throw ValidationException::withMessages([
                'permission' => "The {$permission->name} permission is required by the system and cannot be {$action}.",
            ]);
        }
    }

    protected function flushCache(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
