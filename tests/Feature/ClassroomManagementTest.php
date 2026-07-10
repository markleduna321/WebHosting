<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClassroomManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_publish_a_classroom(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/classrooms', [
            'id' => 'classroom-uuid-001',
            'name' => 'Math 101',
            'description' => 'Core lessons',
            'schedule' => 'MWF 8AM',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('id', 'classroom-uuid-001')
            ->assertJsonPath('owner_id', $user->id);

        $this->assertDatabaseHas('classrooms', [
            'id' => 'classroom-uuid-001',
            'owner_id' => $user->id,
            'name' => 'Math 101',
        ]);
    }

    public function test_owner_can_upload_a_material(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'classroom-uuid-002',
            'owner_id' => $user->id,
            'name' => 'Science',
        ]);

        Sanctum::actingAs($user);

        $response = $this->post('/api/classrooms/classroom-uuid-002/materials', [
            'id' => 'material-uuid-001',
            'file' => UploadedFile::fake()->create('lesson-1.pdf', 128, 'application/pdf'),
            'original_name' => 'Lesson 1.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 131072,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('id', 'material-uuid-001')
            ->assertJsonPath('classroom_id', 'classroom-uuid-002');

        $this->assertDatabaseHas('materials', [
            'id' => 'material-uuid-001',
            'classroom_id' => 'classroom-uuid-002',
        ]);

        $this->assertTrue(Storage::disk('public')->exists('materials/classroom-uuid-002/material-uuid-001.pdf'));
    }

    public function test_non_owner_cannot_delete_a_classroom(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'classroom-uuid-003',
            'owner_id' => $owner->id,
            'name' => 'History',
        ]);

        Sanctum::actingAs($otherUser);

        $this->deleteJson("/api/classrooms/{$classroom->id}")
            ->assertForbidden();
    }

    public function test_deleting_a_classroom_removes_material_records_and_files(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $classroom = Classroom::create([
            'id' => 'classroom-uuid-004',
            'owner_id' => $user->id,
            'name' => 'English',
        ]);

        $material = Material::create([
            'id' => 'material-uuid-002',
            'classroom_id' => $classroom->id,
            'original_name' => 'Chapter 1.pdf',
            'filename' => 'material-uuid-002.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 51200,
            'file_url' => '/storage/materials/classroom-uuid-004/material-uuid-002.pdf',
        ]);

        Storage::disk('public')->put('materials/classroom-uuid-004/material-uuid-002.pdf', 'pdf-data');

        Sanctum::actingAs($user);

        $this->deleteJson("/api/classrooms/{$classroom->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('classrooms', ['id' => $classroom->id]);
        $this->assertDatabaseMissing('materials', ['id' => $material->id]);
        $this->assertFalse(Storage::disk('public')->exists('materials/classroom-uuid-004/material-uuid-002.pdf'));
    }
}