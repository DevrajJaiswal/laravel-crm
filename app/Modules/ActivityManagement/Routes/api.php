<?php

use App\Modules\ActivityManagement\Controllers\Api\ActivityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('customers/{customer}/activities', [ActivityController::class, 'index']);
    Route::post('customers/{customer}/activities', [ActivityController::class, 'store']);
    Route::put('activities/{activity}', [ActivityController::class, 'update']);
    Route::delete('activities/{activity}', [ActivityController::class, 'destroy']);
});
