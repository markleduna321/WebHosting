<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hand_queue', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 36)->index();
            $table->string('student_id')->index();
            $table->string('student_name');
            $table->timestamp('raised_at')->index();
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();

            $table->unique(['session_id', 'student_id'], 'uq_hand');
            $table->foreign('session_id')->references('id')->on('live_sessions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hand_queue');
    }
};