<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up()
  {
    Schema::create('notifications', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->string('event_type')->nullable();
      $table->date('event_date')->nullable();
      $table->string('status');
      $table->string('message');
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::dropIfExists('notifications');
  }
};
