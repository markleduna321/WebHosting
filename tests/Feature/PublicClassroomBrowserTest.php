<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicClassroomBrowserTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_classrooms_can_be_listed_and_searched(): void
    {
        $owner = User::factory()->create(['name' => 'Mr. Smith']);

        $mathClassroom = Classroom::create([
            'id' => 'classroom-browse-001',
            'owner_id' => $owner->id,
            'name' => 'Math 101',
            'description' => 'Fractions and algebra',
            'schedule' => 'MWF 8AM',
        ]);

        Classroom::create([
            'id' => 'classroom-browse-002',
            'owner_id' => $owner->id,
            'name' => 'History 201',
            'description' => 'World history',
            'schedule' => 'TTH 1PM',
        ]);

        Material::create([
            'id' => 'material-browse-001',
            'classroom_id' => $mathClassroom->id,
            'original_name' => 'Lesson 1.pdf',
            'filename' => 'lesson-1.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 2048,
            'file_url' => '/storage/materials/classroom-browse-001/lesson-1.pdf',
        ]);

        $this->getJson('/api/classrooms?search=Math')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', 'classroom-browse-001')
            ->assertJsonPath('data.0.owner_name', 'Mr. Smith')
            ->assertJsonPath('data.0.material_count', 1);
    }

    public function test_public_classroom_detail_can_be_viewed(): void
    {
        $owner = User::factory()->create(['name' => 'Ms. Cruz']);
        $classroom = Classroom::create([
            'id' => 'classroom-browse-003',
            'owner_id' => $owner->id,
            'name' => 'Science Lab',
            'description' => 'Hands-on experiments',
            'schedule' => 'Fri 10AM',
        ]);

        $this->getJson("/api/classrooms/{$classroom->id}")
            ->assertOk()
            ->assertJsonPath('id', $classroom->id)
            ->assertJsonPath('owner_name', 'Ms. Cruz');
    }

    public function test_public_classroom_materials_can_be_viewed(): void
    {
        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'classroom-browse-004',
            'owner_id' => $owner->id,
            'name' => 'Reading Corner',
        ]);

        Material::create([
            'id' => 'material-browse-002',
            'classroom_id' => $classroom->id,
            'original_name' => 'Story Pack.pdf',
            'filename' => 'story-pack.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 4096,
            'file_url' => '/storage/materials/classroom-browse-004/story-pack.pdf',
        ]);

        $this->getJson("/api/classrooms/{$classroom->id}/materials")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.original_name', 'Story Pack.pdf');
    }

    public function test_public_active_session_returns_not_found_when_phase_four_is_not_implemented(): void
    {
        $owner = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'classroom-browse-005',
            'owner_id' => $owner->id,
            'name' => 'Drafting',
        ]);

        $this->getJson("/api/classrooms/{$classroom->id}/active-session")
            ->assertNotFound()
            ->assertJsonPath('message', 'No active session found for this classroom.');
    }
}