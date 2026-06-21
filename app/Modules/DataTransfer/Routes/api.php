<?php

use App\Modules\DataTransfer\Controllers\Api\ExportController;
use App\Modules\DataTransfer\Controllers\Api\ImportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api/data-transfer')->group(function () {
    Route::post('imports', [ImportController::class, 'store'])->middleware('permission:data-transfer.import');
    Route::get('imports', [ImportController::class, 'index'])->middleware('permission:data-transfer.import');
    Route::get('imports/{import}', [ImportController::class, 'show'])->middleware('permission:data-transfer.import');
    Route::post('exports', [ExportController::class, 'export'])->middleware('permission:data-transfer.export');
    Route::get('exports', [ExportController::class, 'index'])->middleware('permission:data-transfer.export');
    Route::get('exports/{export}', [ExportController::class, 'show'])->middleware('permission:data-transfer.export');
});


