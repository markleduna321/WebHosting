<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->unsignedInteger('max_websites')->default(1);
            $table->unsignedInteger('max_databases')->default(1);
            $table->unsignedInteger('disk_space_mb')->default(50);
            $table->unsignedInteger('db_size_mb')->default(50);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'max_websites',
                'max_databases',
                'disk_space_mb',
                'db_size_mb',
            ]);
        });
    }
};
