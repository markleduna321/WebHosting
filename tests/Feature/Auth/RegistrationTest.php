<?php

namespace Tests\Feature\Auth;

use App\Models\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'StrongPass1!',
            'password_confirmation' => 'StrongPass1!',
            'agree_terms' => true,
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_new_users_can_register_with_a_three_month_billing_cycle(): void
    {
        $plan = Plan::create([
            'slug' => 'student',
            'name' => 'Student',
            'monthly_price' => 129,
            'prices' => [3 => 350],
            'period_discounts' => [],
        ]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'cycle-test@example.com',
            'password' => 'StrongPass1!',
            'password_confirmation' => 'StrongPass1!',
            'agree_terms' => true,
            'plan_slug' => $plan->slug,
            'billing_cycle' => '3',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('subscriptions', [
            'plan_id' => $plan->id,
            'billing_cycle' => '3',
        ]);
    }

    public function test_registration_rejects_a_billing_period_not_configured_for_the_plan(): void
    {
        $plan = Plan::create([
            'slug' => 'student',
            'name' => 'Student',
            'monthly_price' => 129,
            'prices' => [3 => 350],
            'period_discounts' => [],
        ]);

        $response = $this->from('/register')->post('/register', [
            'name' => 'Test User',
            'email' => 'unsupported-cycle@example.com',
            'password' => 'StrongPass1!',
            'password_confirmation' => 'StrongPass1!',
            'agree_terms' => true,
            'plan_slug' => $plan->slug,
            'billing_cycle' => '6',
        ]);

        $response->assertRedirect('/register');
        $response->assertSessionHasErrors('billing_cycle');
        $this->assertDatabaseMissing('users', [
            'email' => 'unsupported-cycle@example.com',
        ]);
    }

    public function test_registration_rejects_periods_derived_from_list_shaped_prices(): void
    {
        $plan = Plan::create([
            'slug' => 'pro',
            'name' => 'Pro',
            'monthly_price' => 249,
            'prices' => [249, 2200, 4000, 7000],
            'period_discounts' => [],
        ]);

        $response = $this->from('/register')->post('/register', [
            'name' => 'Test User',
            'email' => 'list-prices@example.com',
            'password' => 'StrongPass1!',
            'password_confirmation' => 'StrongPass1!',
            'agree_terms' => true,
            'plan_slug' => $plan->slug,
            'billing_cycle' => '3',
        ]);

        $response->assertSessionHasErrors('billing_cycle');
        $this->assertDatabaseMissing('users', ['email' => 'list-prices@example.com']);
    }

    public function test_registration_page_sends_month_keyed_prices(): void
    {
        Plan::create([
            'slug' => 'pro',
            'name' => 'Pro',
            'monthly_price' => 249,
            'prices' => [1 => 249, 12 => 2200, 24 => 4000, 48 => 7000],
            'period_discounts' => [],
            'is_active' => true,
        ]);

        $response = $this->get('/register?plan=Pro');

        $response->assertOk();
        $this->assertStringContainsString(
            '"prices":{"1":249,"12":2200,"24":4000,"48":7000}',
            html_entity_decode($response->getContent()),
        );
    }
}
