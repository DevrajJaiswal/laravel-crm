<?php

namespace App\Modules\AccessControl\Providers;

use Illuminate\Support\ServiceProvider;

class AccessControlServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
