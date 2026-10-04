<?php

namespace Tests\Unit;

use App\Models\Payment;
use App\Models\Plan;
use PHPUnit\Framework\TestCase;

class PlanPricingTest extends TestCase
{
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
