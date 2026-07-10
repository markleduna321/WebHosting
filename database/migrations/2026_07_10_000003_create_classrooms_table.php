<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete()->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('schedule')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};