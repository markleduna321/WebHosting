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

    public function test_period_price_uses_configured_total_before_monthly_fallback(): void
    {
        $plan = new Plan([
            'monthly_price' => 129,
            'prices' => [12 => 1000],
        ]);

        $this->assertEquals(1000, $plan->priceForPeriod(12));
        $this->assertEquals(387, $plan->priceForPeriod(3));
    }

    public function test_monthly_price_is_used_without_a_period_discount(): void
    {
        $plan = new Plan(['monthly_price' => 129]);

        $this->assertEquals(129, $plan->priceForPeriod(1));
    }

    public function test_three_and_six_month_cycles_are_supported(): void
    {
        $this->assertContains('3', Payment::VALID_CYCLES);
        $this->assertContains('6', Payment::VALID_CYCLES);
        $this->assertSame(3, Payment::cycleToMonths('3'));
        $this->assertSame(6, Payment::cycleToMonths('6'));
    }
}
