<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_method', 20)->default('qrph')->after('currency')->index();
            $table->string('paymongo_checkout_session_id')->nullable()->after('paymongo_payment_id')->index();
            // Hosted checkout URLs carry a base64 fragment and can exceed 255 chars.
            $table->text('checkout_url')->nullable()->after('paymongo_checkout_session_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['payment_method']);
            $table->dropIndex(['paymongo_checkout_session_id']);
            $table->dropColumn(['payment_method', 'paymongo_checkout_session_id', 'checkout_url']);
        });
    }
};
