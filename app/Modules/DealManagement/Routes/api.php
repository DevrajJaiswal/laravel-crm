<?php

use App\Modules\DealManagement\Controllers\Api\DealController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('deals/customers', [DealController::class, 'customers']);
    Route::get('deals', [DealController::class, 'index']);
    Route::post('deals', [DealController::class, 'store']);
    Route::get('deals/{deal}', [DealController::class, 'show']);
    Route::put('deals/{deal}', [DealController::class, 'update']);
    Route::delete('deals/{deal}', [DealController::class, 'destroy']);
});
