<?php

use App\Modules\ContactManagement\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('customers/{customer}/contacts', [ContactController::class, 'index']);
    Route::post('customers/{customer}/contacts', [ContactController::class, 'store']);
    Route::put('contacts/{contact}', [ContactController::class, 'update']);
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy']);
});
