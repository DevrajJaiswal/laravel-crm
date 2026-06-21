<?php

use App\Modules\DealManagement\Controllers\Api\DealController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('deals/customers', [DealController::class, 'customers'])->middleware('permission:deals.view');
    Route::get('deals', [DealController::class, 'index'])->middleware('permission:deals.view');
    Route::post('deals', [DealController::class, 'store'])->middleware('permission:deals.create');
    Route::get('deals/{deal}', [DealController::class, 'show'])->middleware('permission:deals.view');
    Route::put('deals/{deal}', [DealController::class, 'update'])->middleware('permission:deals.update');
    Route::delete('deals/{deal}', [DealController::class, 'destroy'])->middleware('permission:deals.delete');
});
