<?php

namespace Tests\Feature\Admin;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminUserListTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $user = User::factory()->create(['name' => 'Ada Admin', 'email' => 'ada@example.com']);
        $user->assignRole(Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']));

        return $user;
    }

    public function test_admin_sees_users_with_roles_plan_and_status(): void
    {
        $admin = $this->admin();
        $plan = Plan::create(['slug' => 'pro', 'name' => 'Pro', 'monthly_price' => 249]);

        $student = User::factory()->create([
            'name' => 'Sam Student',
            'email' => 'sam@example.com',
            'two_factor_enabled' => true,
        ]);
        $student->assignRole(Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']));
        $student->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'billing_cycle' => '12',
        ]);

        $pending = User::factory()->unverified()->create(['name' => 'Pat Pending', 'email' => 'pat@example.com']);
        $pending->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_PENDING_PAYMENT,
            'billing_cycle' => '1',
        ]);

        $users = $this->actingAs($admin)
            ->getJson('/api/admin/users')
            ->assertOk()
            ->assertJsonPath('meta.total', 3)
            ->collect('data')
            ->keyBy('email');

        $this->assertSame(['student'], $users['sam@example.com']['roles']);
        $this->assertSame(['name' => 'Pro', 'slug' => 'pro', 'status' => 'active'], $users['sam@example.com']['plan']);
        $this->assertTrue($users['sam@example.com']['email_verified']);
        $this->assertTrue($users['sam@example.com']['two_factor_enabled']);

        $this->assertSame('pending_payment', $users['pat@example.com']['plan']['status']);
        $this->assertFalse($users['pat@example.com']['email_verified']);

        $this->assertSame(['admin'], $users['ada@example.com']['roles']);
        $this->assertNull($users['ada@example.com']['plan']);
    }

    public function test_sensitive_fields_are_never_returned(): void
    {
        User::factory()->create(['two_factor_code' => 'secret-code']);

        $user = $this->actingAs($this->admin())
            ->getJson('/api/admin/users')
            ->assertOk()
            ->json('data.0');

        $this->assertSame(
            ['id', 'name', 'email', 'roles', 'email_verified', 'email_verified_at', 'two_factor_enabled', 'plan', 'created_at'],
            array_keys($user),
        );
    }

    public function test_search_matches_name_or_email(): void
    {
        $admin = $this->admin();
        User::factory()->create(['name' => 'Juan Dela Cruz', 'email' => 'juan@school.edu']);
        User::factory()->create(['name' => 'Maria Clara', 'email' => 'maria@example.com']);

        $this->actingAs($admin)->getJson('/api/admin/users?search=dela')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.email', 'juan@school.edu');

        $this->actingAs($admin)->getJson('/api/admin/users?search=example.com')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_results_are_paginated(): void
    {
        $admin = $this->admin();
        User::factory()->count(20)->create();

        $this->actingAs($admin)->getJson('/api/admin/users?page=2')
            ->assertOk()
            ->assertJsonPath('meta.total', 21)
            ->assertJsonPath('meta.per_page', 15)
            ->assertJsonCount(6, 'data');
    }

    public function test_non_admins_are_forbidden_and_guests_unauthenticated(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson('/api/admin/users')
            ->assertForbidden();

        $this->app['auth']->forgetGuards();

        $this->getJson('/api/admin/users')->assertUnauthorized();
    }
}
