<?php

namespace App\Modules\ImportExport\Providers;

use Illuminate\Support\ServiceProvider;

class ImportExportServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
    }
}
