<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('converted_from_lead_id')
                ->nullable()
                ->unique()
                ->after('owner_id')
                ->constrained('leads')
                ->nullOnDelete();
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->foreignId('converted_customer_id')
                ->nullable()
                ->unique()
                ->after('owner_id')
                ->constrained('customers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropConstrainedForeignId('converted_customer_id');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('converted_from_lead_id');
        });
    }
};
