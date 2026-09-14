<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('github_connections', function (Blueprint $table) {
            $table->id();
            // Unique both ways: one GitHub account per user, and never shared between users.
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('github_user_id')->unique();
            $table->string('github_username');
            $table->string('avatar_url')->nullable();
            $table->text('access_token');
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->json('scopes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('github_connections');
    }
};
