<?php

namespace App\Modules\CustomerManagement\Database\Seeders;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('email', 'admin@example.com')->first();

        if (! $owner) {
            return;
        }

        Customer::updateOrCreate([
            'email' => 'client@example.com',
        ], [
            'name' => 'Client Account',
            'company_name' => 'Acme Trading',
            'email' => 'client@example.com',
            'phone' => '8887776666',
            'status' => 'Active',
            'industry' => 'Retail',
            'billing_address' => '123 Market Street',
            'shipping_address' => '123 Market Street',
            'notes' => 'Priority customer',
            'owner_id' => $owner->id,
        ]);
    }
}

