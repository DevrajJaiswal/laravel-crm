<?php

use App\Modules\ActivityManagement\Controllers\Api\ActivityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('customers/{customer}/activities', [ActivityController::class, 'index'])->middleware('permission:activities.view');
    Route::post('customers/{customer}/activities', [ActivityController::class, 'store'])->middleware('permission:activities.create');
    Route::put('activities/{activity}', [ActivityController::class, 'update'])->middleware('permission:activities.update');
    Route::delete('activities/{activity}', [ActivityController::class, 'destroy'])->middleware('permission:activities.delete');
});
