<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class HostingPlanPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Plan::create(['slug' => 'pro', 'name' => 'Pro', 'monthly_price' => 249, 'is_active' => true]);
        Plan::create(['slug' => 'legacy', 'name' => 'Legacy', 'monthly_price' => 99, 'is_active' => false]);
    }

    public function test_admin_page_loads_plans_from_the_api_not_props(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']));

        $this->actingAs($admin)
            ->get('/hosting')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('hosting-plan/page')
                ->missing('plans'));
    }

    public function test_students_still_receive_only_active_plans(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/hosting')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('hosting-plan/page')
                ->has('plans', 1)
                ->where('plans.0.slug', 'pro'));
    }

    public function test_admin_api_includes_inactive_plans(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']));

        $plans = $this->actingAs($admin)
            ->getJson('/api/admin/plans')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->collect('data')
            ->keyBy('slug');

        $this->assertFalse($plans['legacy']['is_active']);
        $this->assertTrue($plans['pro']['is_active']);
    }
}
