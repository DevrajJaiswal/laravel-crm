<?php

namespace App\Modules\DataTransfer\Providers;

use Illuminate\Support\ServiceProvider;

class DataTransferServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
    }
}


