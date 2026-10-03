<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_conversations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->char('guest_token_hash', 64)->nullable()->index();
            $table->string('guest_email')->nullable();
            $table->string('status', 32)->default('open')->index();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamp('handoff_queued_at')->nullable();
            $table->timestamp('handoff_notified_at')->nullable();
            $table->timestamp('customer_notified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('support_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_conversation_id')->constrained()->cascadeOnDelete();
            $table->string('role', 16);
            $table->text('content');
            $table->timestamps();

            $table->index(['support_conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_messages');
        Schema::dropIfExists('support_conversations');
    }
};
