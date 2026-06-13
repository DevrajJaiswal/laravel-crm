<?php

use App\Modules\Auth\Providers\AuthServiceProvider;
use App\Modules\Setup\Providers\SetupServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    SetupServiceProvider::class,
    AuthServiceProvider::class,
];
