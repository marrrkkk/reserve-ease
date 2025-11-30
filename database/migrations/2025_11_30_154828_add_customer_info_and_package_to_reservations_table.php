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
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreignId('package_id')->nullable()->after('user_id')->constrained()->onDelete('set null');
            $table->string('customer_full_name')->nullable()->after('package_id');
            $table->text('customer_address')->nullable()->after('customer_full_name');
            $table->string('customer_contact_number', 50)->nullable()->after('customer_address');
            $table->string('customer_email')->nullable()->after('customer_contact_number');

            // Indexes for performance
            $table->index('package_id');
            $table->index('customer_email');
            $table->index('event_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['package_id']);
            $table->dropIndex(['package_id']);
            $table->dropIndex(['customer_email']);
            $table->dropIndex(['event_date']);
            $table->dropColumn([
                'package_id',
                'customer_full_name',
                'customer_address',
                'customer_contact_number',
                'customer_email'
            ]);
        });
    }
};
