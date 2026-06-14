<?php

namespace App\Modules\ContactManagement\Providers;

use Illuminate\Support\ServiceProvider;

class ContactManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
    }
}
