<?php

use App\Modules\ContactManagement\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('customers/{customer}/contacts', [ContactController::class, 'index'])->middleware('permission:contacts.view');
    Route::post('customers/{customer}/contacts', [ContactController::class, 'store'])->middleware('permission:contacts.create');
    Route::put('contacts/{contact}', [ContactController::class, 'update'])->middleware('permission:contacts.update');
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->middleware('permission:contacts.delete');
});
