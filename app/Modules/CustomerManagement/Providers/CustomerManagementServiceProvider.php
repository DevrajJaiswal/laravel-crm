<?php

namespace App\Modules\CustomerManagement\Providers;

use Illuminate\Support\ServiceProvider;

class CustomerManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
