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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // customer
            $table->string('event_type'); // e.g., wedding, birthday
            $table->date('event_date');
            $table->time('event_time')->nullable();
            $table->string('venue');
            $table->integer('guest_count');
            $table->text('customization')->nullable(); // JSON string or plain text
            $table->string('status')->default('pending'); // pending, approved, declined, cancelled
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
