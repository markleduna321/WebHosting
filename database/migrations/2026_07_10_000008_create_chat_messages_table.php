<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 36)->index();
            $table->string('sender_id')->index();
            $table->string('sender_name');
            $table->boolean('is_teacher')->default(false)->index();
            $table->text('body');
            $table->timestamp('sent_at')->index();
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('live_sessions')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};