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

class SessionInteractionTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_submit_quiz_response(): void
    {
        $student = User::factory()->create(['name' => 'Alice']);
        $session = $this->createActiveSession();

        Sanctum::actingAs($student);

        $this->postJson("/api/sessions/{$session->id}/quiz/submit", [
            'student_id' => (string) $student->id,
            'student_name' => $student->name,
            'quiz_id' => 'quiz-001',
            'quiz_title' => 'Chapter 3 Quiz',
            'answers' => [
                ['question_id' => 'q1', 'answer' => 'B'],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('status', 'received');

        $this->assertDatabaseHas('quiz_submissions', [
            'session_id' => $session->id,
            'quiz_id' => 'quiz-001',
            'student_name' => 'Alice',
        ]);
    }

    public function test_teacher_can_view_quiz_results(): void
    {
        $teacher = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-interaction-classroom-001',
            'owner_id' => $teacher->id,
            'name' => 'Earth Science',
        ]);
        $session = Session::create([
            'id' => 'session-interaction-live-001',
            'classroom_id' => $classroom->id,
            'owner_id' => $teacher->id,
            'channel' => 'session.session-interaction-live-001',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);

        $this->postJson("/api/sessions/{$session->id}/quiz/submit", [
            'student_id' => '42',
            'student_name' => 'Alice',
            'quiz_id' => 'quiz-002',
            'quiz_title' => 'Review Quiz',
            'answers' => [
                ['question_id' => 'q1', 'answer' => 'True'],
            ],
            'score' => 1,
            'total' => 1,
        ])->assertUnauthorized();

        Sanctum::actingAs($teacher);

        $this->postJson("/api/sessions/{$session->id}/quiz/submit", [
            'student_id' => '42',
            'student_name' => 'Alice',
            'quiz_id' => 'quiz-002',
            'quiz_title' => 'Review Quiz',
            'answers' => [
                ['question_id' => 'q1', 'answer' => 'True'],
            ],
            'score' => 1,
            'total' => 1,
        ])->assertOk();

        $this->getJson("/api/sessions/{$session->id}/quiz/results")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.quiz_title', 'Review Quiz');
    }

    public function test_authenticated_user_can_read_chat_history(): void
    {
        $user = User::factory()->create();
        $session = $this->createActiveSession();

        Sanctum::actingAs($user);

        $this->postJson("/api/sessions/{$session->id}/chat", [
            'sender_id' => (string) $user->id,
            'sender_name' => $user->name,
            'is_teacher' => false,
            'body' => 'Hello class!',
        ])->assertCreated();

        $this->getJson("/api/sessions/{$session->id}/chat")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.body', 'Hello class!');
    }

    public function test_chat_message_broadcasts_session_event(): void
    {
        Event::fake([SessionEvent::class]);

        $user = User::factory()->create(['name' => 'Alice']);
        $session = $this->createActiveSession();

        Sanctum::actingAs($user);

        $this->postJson("/api/sessions/{$session->id}/chat", [
            'sender_id' => (string) $user->id,
            'sender_name' => $user->name,
            'is_teacher' => false,
            'body' => 'Anyone there?',
        ])->assertCreated();

        Event::assertDispatched(SessionEvent::class, function (SessionEvent $event) use ($session) {
            return $event->channel === $session->channel
                && $event->eventName === 'CHAT_MESSAGE'
                && $event->data['body'] === 'Anyone there?';
        });
    }

    private function createActiveSession(): Session
    {
        $teacher = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'session-interaction-classroom-002',
            'owner_id' => $teacher->id,
            'name' => 'Creative Writing',
        ]);

        return Session::create([
            'id' => 'session-interaction-live-002',
            'classroom_id' => $classroom->id,
            'owner_id' => $teacher->id,
            'channel' => 'session.session-interaction-live-002',
            'ws_url' => 'ws://127.0.0.1:8080',
            'status' => 'active',
            'started_at' => Carbon::now(),
        ]);
    }
}