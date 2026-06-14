<?php

use App\Modules\DataTransfer\Controllers\Api\ExportController;
use App\Modules\DataTransfer\Controllers\Api\ImportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api/data-transfer')->group(function () {
    Route::post('imports', [ImportController::class, 'store']);
    Route::get('imports', [ImportController::class, 'index']);
    Route::get('imports/{import}', [ImportController::class, 'show']);
    Route::post('exports', [ExportController::class, 'export']);
    Route::get('exports', [ExportController::class, 'index']);
    Route::get('exports/{export}', [ExportController::class, 'show']);
});

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::post('imports', [ImportController::class, 'store']);
    Route::get('imports', [ImportController::class, 'index']);
    Route::get('imports/{import}', [ImportController::class, 'show']);
    Route::post('exports', [ExportController::class, 'export']);
    Route::get('exports', [ExportController::class, 'index']);
    Route::get('exports/{export}', [ExportController::class, 'show']);
});


