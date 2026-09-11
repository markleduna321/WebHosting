<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Baseline permissions grouped by module.
     *
     * @var array<string, array<int, string>>
     */
    protected array $permissionsByModule = [
        'user' => ['user-list', 'user-create', 'user-edit', 'user-delete'],
        'role' => ['role-list', 'role-create', 'role-edit', 'role-delete'],
        'permission' => ['permission-list', 'permission-create', 'permission-edit', 'permission-delete'],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ($this->permissionsByModule as $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => 'web',
                ]);
            }
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);

        $admin->syncPermissions(Permission::all());

        // Any user without a Spatie role defaults to student (admins are assigned explicitly).
        User::query()->each(function (User $user) use ($student) {
            if (! $user->roles()->exists()) {
                $user->assignRole($student);
            }
        });
    }
}
