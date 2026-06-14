<?php

namespace App\Modules\Core\Database\Seeders;

use App\Modules\AccessControl\Database\Seeders\AccessControlSeeder;
use App\Modules\CustomerManagement\Database\Seeders\CustomerSeeder;
use App\Modules\Users\Database\Seeders\DatabaseSeeder as UsersDatabaseSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsersDatabaseSeeder::class,
            AccessControlSeeder::class,
            CustomerSeeder::class,
        ]);
    }
}
