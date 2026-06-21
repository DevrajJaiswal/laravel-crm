<?php

use App\Modules\CustomerManagement\Controllers\Api\CustomerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('customers', [CustomerController::class, 'index'])->middleware('permission:customers.view');
    Route::post('customers', [CustomerController::class, 'store'])->middleware('permission:customers.create');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->middleware('permission:customers.view');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->middleware('permission:customers.update');
});
