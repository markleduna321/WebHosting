<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('two_factor_code', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        // Hashed codes cannot fit in 6 chars; pending codes are short-lived anyway.
        DB::table('users')->update(['two_factor_code' => null]);

        Schema::table('users', function (Blueprint $table) {
            $table->string('two_factor_code', 6)->nullable()->change();
        });
    }
};
