<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class RealtimePresenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_authorize_active_session_presence_channel(): void
    {
        $owner = User::factory()->create();
        $learner = User::factory()->create(['name' => 'Presence Learner']);
        $classroom = Classroom::create([
            'id' => 'presence-classroom-001',
            'owner_id' => $owner->id,
            'name' => 'Presence Room',
        ]);
        $session = Session::create([
            'id' => 'presence-session-001',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.presence-session-001',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        $response = $this->actingAs($learner)->post('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => $session->channel,
        ]);

        $response->assertOk();
        $response->assertSee('Presence Learner');
    }

    public function test_guest_cannot_authorize_presence_channel(): void
    {
        $response = $this->post('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => 'session.presence-session-002',
        ]);

        $response->assertForbidden();
    }

    public function test_presence_channel_rejects_ended_session(): void
    {
        $owner = User::factory()->create();
        $learner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'presence-classroom-002',
            'owner_id' => $owner->id,
            'name' => 'Closed Presence Room',
        ]);
        $session = Session::create([
            'id' => 'presence-session-003',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.presence-session-003',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'ended',
            'started_at' => Carbon::now()->subHour(),
            'ended_at' => Carbon::now(),
        ]);

        $response = $this->actingAs($learner)->post('/broadcasting/auth', [
            'socket_id' => '1234.5678',
            'channel_name' => $session->channel,
        ]);

        $response->assertForbidden();
    }
}