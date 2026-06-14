<?php

namespace App\Modules\NotificationManagement\Providers;

use Illuminate\Support\ServiceProvider;

class NotificationManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
    }
}
