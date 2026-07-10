<?php

namespace Tests\Feature;

use App\Events\SessionEvent;
use App\Models\Classroom;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HandQueueTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_raise_hand_and_broadcast_queue(): void
    {
        Event::fake([SessionEvent::class]);

        $student = User::factory()->create(['name' => 'Alice']);
        $session = $this->createActiveSession();

        Sanctum::actingAs($student);

        $this->postJson("/api/sessions/{$session->id}/hand/raise", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
        ])->assertNoContent();

        $this->assertDatabaseHas('hand_queue', [
            'session_id' => $session->id,
            'student_id' => (string) $student->id,
        ]);

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) use ($student) {
            return $event->eventName === 'HAND_UPDATE'
                && $event->data['queue'][0]['id'] === (string) $student->id
                && $event->data['queue'][0]['name'] === 'Alice';
        });
    }

    public function test_duplicate_raise_replaces_existing_entry(): void
    {
        $student = User::factory()->create(['name' => 'Alice']);
        $session = $this->createActiveSession();

        Sanctum::actingAs($student);

        $this->postJson("/api/sessions/{$session->id}/hand/raise", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
        ])->assertNoContent();

        $this->postJson("/api/sessions/{$session->id}/hand/raise", [
            'student_id' => (string) $student->id,
            'student_name' => 'Alice Updated',
        ])->assertNoContent();

        $this->assertDatabaseCount('hand_queue', 1);
        $this->assertDatabaseHas('hand_queue', [
            'session_id' => $session->id,
            'student_id' => (string) $student->id,
            'student_name' => 'Alice Updated',
        ]);
    }

    public function test_student_can_lower_hand(): void
    {
        Event::fake([SessionEvent::class]);

        $student = User::factory()->create(['name' => 'Alice']);
        $session = $this->createActiveSession();

        Sanctum::actingAs($student);

        $this->postJson("/api/sessions/{$session->id}/hand/raise", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
        ])->assertNoContent();

        $this->postJson("/api/sessions/{$session->id}/hand/lower", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
        ])->assertNoContent();

        $this->assertDatabaseMissing('hand_queue', [
            'session_id' => $session->id,
            'student_id' => (string) $student->id,
        ]);

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) {
            return $event->eventName === 'HAND_UPDATE'
                && $event->data['queue'] === [];
        });
    }

    public function test_teacher_can_call_on_student_and_broadcast_queue_updates(): void
    {
        Event::fake([SessionEvent::class]);

        $teacher = User::factory()->create();
        $student = User::factory()->create(['name' => 'Alice']);
        $classroom = Classroom::create([
            'id' => 'hand-queue-classroom-001',
            'owner_id' => $teacher->id,
            'name' => 'Public Speaking',
        ]);
        $session = Session::create([
            'id' => 'hand-queue-live-001',
            'classroom_id' => $classroom->id,
            'owner_id' => $teacher->id,
            'channel' => 'session.hand-queue-live-001',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        Sanctum::actingAs($student);
        $this->postJson("/api/sessions/{$session->id}/hand/raise", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
        ])->assertNoContent();

        Sanctum::actingAs($teacher);
        $this->postJson("/api/sessions/{$session->id}/hand/call", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
        ])->assertNoContent();

        $this->assertDatabaseMissing('hand_queue', [
            'session_id' => $session->id,
            'student_id' => (string) $student->id,
        ]);

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) use ($student) {
            return $event->eventName === 'CALLED_ON'
                && $event->data['target'] === (string) $student->id;
        });

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) {
            return $event->eventName === 'HAND_UPDATE'
                && $event->data['queue'] === [];
        });
    }

    private function createActiveSession(): Session
    {
        $teacher = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'hand-queue-classroom-002',
            'owner_id' => $teacher->id,
            'name' => 'Discussion Room',
        ]);

        return Session::create([
            'id' => 'hand-queue-live-002',
            'classroom_id' => $classroom->id,
            'owner_id' => $teacher->id,
            'channel' => 'session.hand-queue-live-002',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);
    }
}