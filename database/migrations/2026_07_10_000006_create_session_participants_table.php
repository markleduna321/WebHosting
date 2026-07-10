<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_participants', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 36)->index();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->index();
            $table->string('student_id')->index();
            $table->string('student_name');
            $table->timestamp('joined_at')->index();
            $table->timestamp('left_at')->nullable();
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('live_sessions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_participants');
    }
};