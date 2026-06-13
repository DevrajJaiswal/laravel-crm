<?php

use App\Modules\AccessControl\Controllers\Api\PermissionController;
use App\Modules\AccessControl\Controllers\Api\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api/access-control')->group(function () {
    Route::get('roles', [RoleController::class, 'index']);
    Route::post('roles', [RoleController::class, 'store']);
    Route::get('roles/{role}', [RoleController::class, 'show']);
    Route::put('roles/{role}', [RoleController::class, 'update']);
    Route::delete('roles/{role}', [RoleController::class, 'destroy']);
    Route::put('roles/{role}/permissions', [RoleController::class, 'syncPermissions']);

    Route::get('permissions', [PermissionController::class, 'index']);
});
