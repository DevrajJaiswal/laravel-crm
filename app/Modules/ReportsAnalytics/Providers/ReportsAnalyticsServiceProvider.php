<?php

namespace App\Modules\ReportsAnalytics\Providers;

use Illuminate\Support\ServiceProvider;

class ReportsAnalyticsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
