<?php

namespace Database\Seeders;

use App\Modules\Core\Database\Seeders\DatabaseSeeder as CoreDatabaseSeeder;

// Root seeder stays as a thin bootstrap entrypoint.
class DatabaseSeeder extends \Illuminate\Database\Seeder
{
    public function run(): void
    {
        $this->call([CoreDatabaseSeeder::class]);
    }
}
