<?php

namespace App\Modules\Users\Providers;

use App\Modules\Users\Database\Seeders\AdminUserSeeder;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Artisan;

class UsersServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }

    public function register(): void
    {
        // Publish seeders to database/seeders
        $this->publishes([
            __DIR__ . '/../Database/Seeders/AdminUserSeeder.php' => 
            database_path('seeders/Users/AdminUserSeeder.php'),
        ], 'module-seeders');
    }
}
