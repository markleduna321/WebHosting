<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\GithubConnection;
use App\Models\Role;
use App\Models\User;
use App\Policies\GithubConnectionPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\RolePolicy;
use App\Policies\StudentDatabasePolicy;
use App\Policies\UserPolicy;
use App\Policies\WebsitePolicy;
use Spatie\Permission\Models\Permission;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        Permission::class => PermissionPolicy::class,
        GithubConnection::class => GithubConnectionPolicy::class,
        \App\Models\Website::class => WebsitePolicy::class,
        \App\Models\StudentDatabase::class => StudentDatabasePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
