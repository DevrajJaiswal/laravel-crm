<?php

use App\Modules\ReportsAnalytics\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('reports/summary', [ReportController::class, 'summary'])->middleware('permission:reports.view');
});
