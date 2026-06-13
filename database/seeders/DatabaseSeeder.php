<?php

namespace Database\Seeders;

use App\Modules\AccessControl\Database\Seeders\AccessControlSeeder;
use App\Modules\Users\Database\Seeders\AdminUserSeeder;

// Modules auto-register their seeders via ServiceProviders
class DatabaseSeeder extends \Illuminate\Database\Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            AccessControlSeeder::class,
        ]);
    }
}
