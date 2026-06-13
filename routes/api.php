<?php

use App\Modules\Setup\Controllers\Api\HealthCheckController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthCheckController::class);
