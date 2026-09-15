<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('websites', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('subdomain')->unique();
            $table->string('repository_full_name');
            $table->string('repository_default_branch');
            $table->boolean('repository_private')->default(false);
            $table->string('status')->default('queued');
            // Relative to the local disk root; never web-servable.
            $table->string('storage_path')->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->unsignedInteger('file_count')->default(0);
            $table->text('failure_reason')->nullable();
            $table->timestamp('last_deployed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('websites');
    }
};
