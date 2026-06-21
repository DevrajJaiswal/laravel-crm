<?php

use App\Modules\LeadManagement\Controllers\Api\LeadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('leads', [LeadController::class, 'index'])->middleware('permission:leads.view');
    Route::post('leads', [LeadController::class, 'store'])->middleware('permission:leads.create');
    Route::get('leads/{lead}', [LeadController::class, 'show'])->middleware('permission:leads.view');
    Route::put('leads/{lead}', [LeadController::class, 'update'])->middleware('permission:leads.update');
    Route::delete('leads/{lead}', [LeadController::class, 'destroy'])->middleware('permission:leads.delete');
});
