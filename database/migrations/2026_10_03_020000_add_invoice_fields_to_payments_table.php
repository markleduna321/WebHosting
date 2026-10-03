<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('invoice_number', 32)->nullable()->unique()->after('uuid');
            $table->timestamp('invoice_issued_at')->nullable()->after('paid_at');
            $table->json('line_items')->nullable()->after('addons');
            // PayMongo's charges to the merchant, in centavos. Internal records only.
            $table->unsignedInteger('paymongo_fee')->nullable()->after('checkout_url');
            $table->unsignedInteger('paymongo_foreign_fee')->nullable()->after('paymongo_fee');
            $table->unsignedInteger('paymongo_tax_amount')->nullable()->after('paymongo_foreign_fee');
            $table->unsignedInteger('paymongo_net_amount')->nullable()->after('paymongo_tax_amount');
            $table->json('paymongo_taxes')->nullable()->after('paymongo_net_amount');
        });

        // Number historical paid payments in payment order so earlier invoices stay downloadable.
        $prefix = config('invoice.number_prefix', 'CAL');
        $counters = [];

        DB::table('payments')
            ->where('status', 'paid')
            ->whereNull('invoice_number')
            ->orderBy('paid_at')
            ->orderBy('id')
            ->get(['id', 'paid_at', 'created_at'])
            ->each(function ($row) use ($prefix, &$counters) {
                $issued = $row->paid_at ?? $row->created_at;
                $year = substr((string) $issued, 0, 4);
                $counters[$year] = ($counters[$year] ?? 0) + 1;

                DB::table('payments')->where('id', $row->id)->update([
                    'invoice_number' => "{$prefix}-{$year}-".str_pad((string) $counters[$year], 6, '0', STR_PAD_LEFT),
                    'invoice_issued_at' => $issued,
                ]);
            });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropUnique(['invoice_number']);
            $table->dropColumn([
                'invoice_number',
                'invoice_issued_at',
                'line_items',
                'paymongo_fee',
                'paymongo_foreign_fee',
                'paymongo_tax_amount',
                'paymongo_net_amount',
                'paymongo_taxes',
            ]);
        });
    }
};
