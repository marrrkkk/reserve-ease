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
        Schema::create('package_customizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->string('selected_table_type', 100)->nullable();
            $table->string('selected_chair_type', 100)->nullable();
            $table->json('selected_foods')->nullable();
            $table->text('customization_notes')->nullable();
            $table->timestamps();

            // Index for performance
            $table->index('reservation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_customizations');
    }
};
