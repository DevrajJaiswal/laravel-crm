<?php

namespace App\Modules\Setup\Providers;

use Illuminate\Support\ServiceProvider;

class SetupServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Setup module has no routes - it's just the health check which stays in api.php
    }
}
