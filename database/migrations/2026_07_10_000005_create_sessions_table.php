<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_sessions', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('classroom_id', 36)->index();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete()->index();
            $table->string('channel')->unique();
            $table->string('ws_url', 500);
            $table->enum('status', ['active', 'ended'])->default('active')->index();
            $table->timestamp('started_at')->index();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();

            $table->foreign('classroom_id')->references('id')->on('classrooms')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_sessions');
    }
};