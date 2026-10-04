<?php

namespace Tests\Unit;

use App\Http\Resources\PlanResource;
use App\Models\Payment;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class PlanPricingTest extends TestCase
{
    public function test_month_keyed_prices_offer_exactly_the_saved_periods_and_totals(): void
    {
        $plan = new Plan([
            'slug' => 'pro',
            'monthly_price' => 249,
            'prices' => [1 => 249, 12 => 2200, 24 => 4000, 48 => 7000],
            'period_discounts' => [],
        ]);

        $this->assertSame([1, 12, 24, 48], $plan->billingPeriods());
        $this->assertEquals(2200, $plan->priceForPeriod(12));
        $this->assertEquals(4000, $plan->priceForPeriod(24));
        $this->assertEquals(7000, $plan->priceForPeriod(48));
        $this->assertNull($plan->priceForPeriod(3));
    }

    public function test_list_shaped_prices_are_ignored_instead_of_read_as_months(): void
    {
        Log::spy();

        $plan = new Plan([
            'slug' => 'pro',
            'monthly_price' => 249,
            'prices' => [249, 2200, 4000, 7000],
            'period_discounts' => [],
        ]);

        $this->assertSame([1], $plan->billingPeriods());
        $this->assertNull($plan->priceForPeriod(2));
        $this->assertNull($plan->priceForPeriod(3));
        $this->assertFalse($plan->supportsBillingPeriod(3));

        Log::shouldHaveReceived('warning')->once();
    }

    public function test_resource_serializes_period_maps_as_objects(): void
    {
        $plan = new Plan([
            'slug' => 'pro',
            'monthly_price' => 249,
            'prices' => [1 => 249, 12 => 2200],
            'period_discounts' => [],
        ]);

        $json = json_encode((new PlanResource($plan))->toArray(Request::create('/')));

        $this->assertStringContainsString('"prices":{"1":249,"12":2200}', $json);
        $this->assertStringContainsString('"periodDiscounts":{}', $json);
    }

    public function test_configured_percentage_discount_overrides_the_period_price(): void
    {
        $plan = new Plan([
            'monthly_price' => 129,
            'prices' => [48 => 3000],
            'period_discounts' => [48 => 30],
        ]);

        $this->assertEquals(4334.40, $plan->priceForPeriod(48));
    }

    public function test_unconfigured_period_is_unavailable(): void
    {
        $plan = new Plan([
            'monthly_price' => 129,
            'prices' => [12 => 1000],
        ]);

        $this->assertEquals(1000, $plan->priceForPeriod(12));
        $this->assertNull($plan->priceForPeriod(3));
        $this->assertSame([1, 12], $plan->billingPeriods());
    }

    public function test_configured_discount_period_is_available_without_a_saved_total(): void
    {
        $plan = new Plan([
            'monthly_price' => 129,
            'prices' => [],
            'period_discounts' => [48 => 30],
        ]);

        $this->assertSame([1, 48], $plan->billingPeriods());
        $this->assertTrue($plan->supportsBillingPeriod(48));
        $this->assertFalse($plan->supportsBillingPeriod(24));
    }

    public function test_monthly_price_is_used_without_a_period_discount(): void
    {
        $plan = new Plan(['monthly_price' => 129]);

        $this->assertEquals(129, $plan->priceForPeriod(1));
    }

    public function test_numeric_billing_cycles_are_supported_dynamically(): void
    {
        $this->assertSame(3, Payment::cycleToMonths('3'));
        $this->assertSame(6, Payment::cycleToMonths('6'));
        $this->assertSame(9, Payment::cycleToMonths('9'));
        $this->assertTrue(Payment::isValidCycle('9'));
        $this->assertFalse(Payment::isValidCycle('0'));
    }
}
