<?php

use App\Modules\LeadManagement\Controllers\Api\LeadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('leads', [LeadController::class, 'index']);
    Route::post('leads', [LeadController::class, 'store']);
    Route::get('leads/{lead}', [LeadController::class, 'show']);
    Route::put('leads/{lead}', [LeadController::class, 'update']);
    Route::delete('leads/{lead}', [LeadController::class, 'destroy']);
});
