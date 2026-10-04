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
            'prices' => [],
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
}
