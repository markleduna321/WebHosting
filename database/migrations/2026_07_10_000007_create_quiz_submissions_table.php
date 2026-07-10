<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('session_id', 36)->index();
            $table->string('student_id')->index();
            $table->string('student_name');
            $table->string('quiz_id', 36)->index();
            $table->string('quiz_title');
            $table->integer('score')->default(0);
            $table->integer('total')->default(0);
            $table->json('answers_json');
            $table->timestamp('submitted_at')->index();
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('live_sessions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_submissions');
    }
};