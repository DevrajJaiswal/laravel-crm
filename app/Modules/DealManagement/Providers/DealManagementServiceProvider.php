<?php

namespace App\Modules\DealManagement\Providers;

use Illuminate\Support\ServiceProvider;

class DealManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
