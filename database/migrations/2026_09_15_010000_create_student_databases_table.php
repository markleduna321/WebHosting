<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_databases', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            // The real MySQL identifiers. Always derived server-side, never user input.
            $table->string('db_name', 64)->unique();
            $table->string('db_user', 32)->unique();
            $table->text('db_password');
            $table->string('host');
            $table->unsignedSmallInteger('port')->default(3306);
            $table->unsignedInteger('quota_mb')->default(256);
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('status')->default('provisioning');
            $table->text('failure_reason')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_databases');
    }
};
