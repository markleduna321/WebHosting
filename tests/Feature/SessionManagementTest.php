<?php

namespace Tests\Feature;

use App\Events\SessionEvent;
use App\Models\Classroom;
use App\Models\Session;
use App\Models\SessionParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SessionManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_a_live_session(): void
    {
        config()->set('broadcasting.default', 'reverb');
        config()->set('broadcasting.connections.reverb.options.host', '127.0.0.1');
        config()->set('broadcasting.connections.reverb.options.port', 8080);
        config()->set('broadcasting.connections.reverb.options.scheme', 'http');

        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-001',
            'owner_id' => $owner->id,
            'name' => 'Physics',
        ]);

        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/sessions', [
            'classroom_id' => $classroom->id,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('classroom_id', $classroom->id)
            ->assertJsonPath('status', 'active')
            ->assertJsonPath('presence_channel', fn ($value) => $value === null || str_starts_with($value, 'session.'))
            ->assertJsonPath('ws_url', 'ws://127.0.0.1:8080');

        $this->assertDatabaseHas('live_sessions', [
            'classroom_id' => $classroom->id,
            'status' => 'active',
        ]);
    }

    public function test_second_active_session_for_same_classroom_returns_conflict(): void
    {
        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-002',
            'owner_id' => $owner->id,
            'name' => 'Chemistry',
        ]);

        Session::create([
            'id' => 'session-live-001',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-001',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        $this->postJson('/api/sessions', [
            'classroom_id' => $classroom->id,
        ])->assertStatus(409);
    }

    public function test_owner_can_view_session_participants(): void
    {
        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-003',
            'owner_id' => $owner->id,
            'name' => 'Literature',
        ]);
        $session = Session::create([
            'id' => 'session-live-002',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-002',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        SessionParticipant::create([
            'session_id' => $session->id,
            'student_id' => 'student-42',
            'student_name' => 'Alice',
            'joined_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        $this->getJson("/api/sessions/{$session->id}/participants")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.student_name', 'Alice');
    }

    public function test_owner_can_broadcast_session_event(): void
    {
        Event::fake([SessionEvent::class]);

        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-004',
            'owner_id' => $owner->id,
            'name' => 'Geometry',
        ]);
        $session = Session::create([
            'id' => 'session-live-003',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-003',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        $this->postJson("/api/sessions/{$session->id}/broadcast", [
            'event' => 'SLIDE_START',
            'data' => [
                'url' => 'https://example.test/slide.pdf',
            ],
        ])->assertNoContent();

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) use ($session) {
            return $event->channel === $session->channel
                && $event->eventName === 'SLIDE_START'
                && $event->data['url'] === 'https://example.test/slide.pdf';
        });
    }

    public function test_owner_can_broadcast_webrtc_offer_event(): void
    {
        Event::fake([SessionEvent::class]);

        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-006',
            'owner_id' => $owner->id,
            'name' => 'Computer Lab',
        ]);
        $session = Session::create([
            'id' => 'session-live-005',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-005',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        $this->postJson("/api/sessions/{$session->id}/broadcast", [
            'event' => 'WEBRTC_OFFER',
            'data' => [
                'from' => 'teacher-1',
                'to' => 'student-1',
                'sdp' => 'fake-offer',
                'type' => 'offer',
            ],
        ])->assertNoContent();

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) {
            return $event->eventName === 'WEBRTC_OFFER'
                && $event->data['from'] === 'teacher-1'
                && $event->data['to'] === 'student-1';
        });
    }

    public function test_webrtc_join_broadcast_upserts_session_participant(): void
    {
        Event::fake([SessionEvent::class]);

        $owner = User::factory()->create();
        $learner = User::factory()->create(['name' => 'Realtime Learner']);
        $classroom = Classroom::create([
            'id' => 'session-classroom-010',
            'owner_id' => $owner->id,
            'name' => 'Realtime Sync',
        ]);
        $session = Session::create([
            'id' => 'session-live-009',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-009',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($learner);

        $this->postJson("/api/sessions/{$session->id}/broadcast", [
            'event' => 'WEBRTC_JOIN',
            'data' => [
                'from' => (string) $learner->id,
                'name' => $learner->name,
                'sessionId' => $session->id,
            ],
        ])->assertNoContent();

        $this->assertDatabaseHas('session_participants', [
            'session_id' => $session->id,
            'student_id' => (string) $learner->id,
            'student_name' => 'Realtime Learner',
        ]);
    }

    public function test_owner_can_broadcast_mute_command(): void
    {
        Event::fake([SessionEvent::class]);

        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-007',
            'owner_id' => $owner->id,
            'name' => 'Speech',
        ]);
        $session = Session::create([
            'id' => 'session-live-006',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-006',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        $this->postJson("/api/sessions/{$session->id}/broadcast", [
            'event' => 'MUTE_COMMAND',
            'data' => [
                'target' => 'all',
                'action' => 'mute',
            ],
        ])->assertNoContent();

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) {
            return $event->eventName === 'MUTE_COMMAND'
                && $event->data['target'] === 'all'
                && $event->data['action'] === 'mute';
        });
    }

    public function test_signaling_events_require_expected_payload_fields(): void
    {
        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-008',
            'owner_id' => $owner->id,
            'name' => 'Debate',
        ]);
        $session = Session::create([
            'id' => 'session-live-007',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-007',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        $this->postJson("/api/sessions/{$session->id}/broadcast", [
            'event' => 'WEBRTC_OFFER',
            'data' => [
                'from' => 'teacher-1',
            ],
        ])->assertStatus(422)
          ->assertJsonValidationErrors('data');
    }

    public function test_broadcast_route_is_rate_limited_for_participant_update_bursts(): void
    {
        Event::fake([SessionEvent::class]);

        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-009',
            'owner_id' => $owner->id,
            'name' => 'Bridge Room',
        ]);
        $session = Session::create([
            'id' => 'session-live-008',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-008',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($owner);

        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->postJson("/api/sessions/{$session->id}/broadcast", [
                'event' => 'PARTICIPANT_UPDATE',
                'data' => [
                    'source' => 'bridge',
                    'name' => 'LAN Student',
                    'connected' => true,
                    'total_lan' => $attempt + 1,
                ],
            ])->assertNoContent();
        }

        $this->postJson("/api/sessions/{$session->id}/broadcast", [
            'event' => 'PARTICIPANT_UPDATE',
            'data' => [
                'source' => 'bridge',
                'name' => 'LAN Student',
                'connected' => true,
                'total_lan' => 11,
            ],
        ])->assertStatus(429);
    }

    public function test_public_active_session_endpoint_returns_live_session_when_present(): void
    {
        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-classroom-005',
            'owner_id' => $owner->id,
            'name' => 'Biology',
        ]);
        $session = Session::create([
            'id' => 'session-live-004',
            'classroom_id' => $classroom->id,
            'owner_id' => $owner->id,
            'channel' => 'session.session-live-004',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        $this->getJson("/api/classrooms/{$classroom->id}/active-session")
            ->assertOk()
            ->assertJsonPath('id', $session->id)
            ->assertJsonPath('channel', $session->channel);
    }
}