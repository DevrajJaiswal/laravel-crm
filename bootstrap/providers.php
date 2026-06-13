<?php

use App\Modules\Auth\Providers\AuthServiceProvider;
use App\Modules\Setup\Providers\SetupServiceProvider;
use App\Modules\Users\Providers\UsersServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    SetupServiceProvider::class,
    AuthServiceProvider::class,
    UsersServiceProvider::class,
];
