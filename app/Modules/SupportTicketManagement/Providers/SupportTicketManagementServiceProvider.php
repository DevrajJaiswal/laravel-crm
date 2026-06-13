<?php

namespace App\Modules\SupportTicketManagement\Providers;

use Illuminate\Support\ServiceProvider;

class SupportTicketManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
