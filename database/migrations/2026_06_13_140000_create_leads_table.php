<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company_name');
            $table->string('contact_name');
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('source', 100);
            $table->string('status', 100);
            $table->decimal('value', 12, 2)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
