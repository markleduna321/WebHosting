<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('classroom_id', 36)->index();
            $table->string('original_name');
            $table->string('filename');
            $table->string('mime_type', 100)->index();
            $table->unsignedBigInteger('size_bytes');
            $table->string('file_url', 500);
            $table->timestamps();

            $table->foreign('classroom_id')->references('id')->on('classrooms')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};