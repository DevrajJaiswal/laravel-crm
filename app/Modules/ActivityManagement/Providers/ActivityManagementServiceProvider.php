<?php

namespace App\Modules\ActivityManagement\Providers;

use Illuminate\Support\ServiceProvider;

class ActivityManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
    }
}
