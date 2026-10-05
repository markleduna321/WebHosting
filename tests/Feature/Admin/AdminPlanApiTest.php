<?php

namespace Tests\Feature\Admin;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminPlanApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->assignRole(Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']));

        return $user;
    }

    private function proPlan(array $overrides = []): Plan
    {
        return Plan::create(array_merge([
            'slug' => 'pro',
            'name' => 'Pro',
            'subtitle' => 'For growing student projects',
            'monthly_price' => 249,
            'prices' => [1 => 249, 12 => 2200, 24 => 4000, 48 => 7000],
            'period_discounts' => [],
            'features' => ['3 Sites'],
            'is_active' => true,
            'disk_space_mb' => 200,
            'max_databases' => 1,
        ], $overrides));
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Pro',
            'subtitle' => 'For growing student projects',
            'monthly_price' => 249,
            'prices' => ['1' => 249, '12' => 2200, '24' => 4000, '48' => 7000],
            'period_discounts' => [],
            'features' => ['3 Sites'],
        ], $overrides);
    }

    public function test_admin_lists_plans_with_object_maps_and_charged_totals(): void
    {
        $this->proPlan(['period_discounts' => [48 => 30]]);

        $response = $this->actingAs($this->admin())->getJson('/api/admin/plans');

        $response->assertOk()
            ->assertJsonPath('data.0.slug', 'pro')
            ->assertJsonPath('data.0.disk_space_mb', 200)
            ->assertJsonPath('data.0.has_invalid_pricing', false)
            ->assertJsonPath('data.0.billing_periods.12', 2200)
            // The 30% discount overrides the saved 48-month total.
            ->assertJsonPath('data.0.billing_periods.48', 8366.4);

        $this->assertStringContainsString('"prices":{"1":249,"12":2200,"24":4000,"48":7000}', $response->getContent());
    }

    public function test_list_shaped_stored_prices_are_flagged(): void
    {
        $this->proPlan(['prices' => [249, 2200, 4000, 7000]]);

        $response = $this->actingAs($this->admin())->getJson('/api/admin/plans');

        $response->assertOk()
            ->assertJsonPath('data.0.has_invalid_pricing', true);
        $this->assertStringContainsString('"prices":{"0":249,"1":2200,"2":4000,"3":7000}', $response->getContent());
        $this->assertStringContainsString('"billing_periods":{"1":249}', $response->getContent());
    }

    public function test_admin_updates_a_plan_by_slug_and_saves_month_keyed_json(): void
    {
        $this->proPlan();

        $this->actingAs($this->admin())
            ->putJson('/api/admin/plans/pro', $this->payload([
                'prices' => ['12' => 2100, '24' => 3900],
                'period_discounts' => ['48' => 30],
            ]))
            ->assertOk()
            ->assertJsonPath('data.billing_periods.12', 2100)
            ->assertJsonPath('data.billing_periods.48', 8366.4);

        $row = DB::table('plans')->where('slug', 'pro')->first();
        $this->assertJsonStringEqualsJsonString('{"12":2100,"24":3900}', $row->prices);
        $this->assertJsonStringEqualsJsonString('{"48":30}', $row->period_discounts);
    }

    public function test_cleared_maps_are_stored_as_json_objects(): void
    {
        $this->proPlan(['period_discounts' => [48 => 30]]);

        $this->actingAs($this->admin())
            ->putJson('/api/admin/plans/pro', $this->payload(['prices' => null, 'period_discounts' => []]))
            ->assertOk()
            ->assertJsonPath('data.billing_periods', ['1' => 249]);

        $row = DB::table('plans')->where('slug', 'pro')->first();
        $this->assertSame('{}', $row->prices);
        $this->assertSame('{}', $row->period_discounts);
    }

    public function test_renaming_a_plan_keeps_its_slug(): void
    {
        $this->proPlan();

        $this->actingAs($this->admin())
            ->putJson('/api/admin/plans/pro', $this->payload(['name' => 'Pro Plus']))
            ->assertOk()
            ->assertJsonPath('data.slug', 'pro')
            ->assertJsonPath('data.name', 'Pro Plus');
    }

    public function test_list_shaped_prices_are_rejected(): void
    {
        $this->proPlan();

        $this->actingAs($this->admin())
            ->putJson('/api/admin/plans/pro', $this->payload(['prices' => [249, 2200, 4000, 7000]]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('prices');

        $this->assertJsonStringEqualsJsonString(
            '{"1":249,"12":2200,"24":4000,"48":7000}',
            DB::table('plans')->where('slug', 'pro')->value('prices'),
        );
    }

    public function test_invalid_month_keys_and_discounts_are_rejected(): void
    {
        $this->proPlan();
        $admin = $this->admin();

        $this->actingAs($admin)
            ->putJson('/api/admin/plans/pro', $this->payload(['prices' => ['abc' => 100]]))
            ->assertJsonValidationErrors('prices');

        $this->actingAs($admin)
            ->putJson('/api/admin/plans/pro', $this->payload(['period_discounts' => ['1' => 10]]))
            ->assertJsonValidationErrors('period_discounts');

        $this->actingAs($admin)
            ->putJson('/api/admin/plans/pro', $this->payload(['period_discounts' => ['48' => 101]]))
            ->assertJsonValidationErrors('period_discounts.48');
    }

    public function test_admin_creates_and_deletes_a_plan_by_slug(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->postJson('/api/admin/plans', $this->payload(['name' => 'Team Pack']))
            ->assertCreated()
            ->assertJsonPath('data.slug', 'team-pack');

        $this->actingAs($admin)
            ->deleteJson('/api/admin/plans/team-pack')
            ->assertNoContent();

        $this->assertDatabaseMissing('plans', ['slug' => 'team-pack']);
    }

    public function test_non_admin_cannot_manage_plans(): void
    {
        $this->proPlan();
        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/admin/plans')->assertForbidden();
        $this->actingAs($user)->putJson('/api/admin/plans/pro', $this->payload())->assertForbidden();
    }
}
