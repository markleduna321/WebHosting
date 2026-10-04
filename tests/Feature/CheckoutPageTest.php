<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CheckoutPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_shaped_prices_fall_back_to_monthly_checkout(): void
    {
        Plan::create([
            'slug' => 'pro',
            'name' => 'Pro',
            'monthly_price' => 249,
            'prices' => [249, 2200, 4000, 7000],
            'period_discounts' => [],
            'is_active' => true,
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->get('/checkout/pro?cycle=3');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('checkout/page')
            ->where('cycle', '1'));
        $this->assertStringContainsString(
            '"prices":{},"periodDiscounts":{}',
            html_entity_decode($response->getContent()),
        );
    }

    public function test_configured_period_is_kept_with_month_keyed_prices(): void
    {
        Plan::create([
            'slug' => 'pro',
            'name' => 'Pro',
            'monthly_price' => 249,
            'prices' => [1 => 249, 12 => 2200, 24 => 4000, 48 => 7000],
            'period_discounts' => [],
            'is_active' => true,
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->get('/checkout/pro?cycle=48');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('checkout/page')
            ->where('cycle', '48'));
        $this->assertStringContainsString(
            '"prices":{"1":249,"12":2200,"24":4000,"48":7000}',
            html_entity_decode($response->getContent()),
        );
    }
}
