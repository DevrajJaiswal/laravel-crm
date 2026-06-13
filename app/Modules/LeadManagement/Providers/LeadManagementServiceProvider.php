<?php

namespace App\Modules\LeadManagement\Providers;

use Illuminate\Support\ServiceProvider;

class LeadManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
