<?php

use App\Modules\ImportExport\Controllers\Api\ImportController;
use App\Modules\ImportExport\Controllers\Api\ExportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api','auth:sanctum'])->prefix('api')->group(function () {
    Route::post('imports', [ImportController::class, 'store']);
    Route::get('imports', [ImportController::class, 'index']);
    Route::get('imports/{import}', [ImportController::class, 'show']);
    Route::post('exports', [ExportController::class, 'export']);
    Route::get('exports', [ExportController::class, 'index']);
    Route::get('exports/{export}', [ExportController::class, 'show']);
});
