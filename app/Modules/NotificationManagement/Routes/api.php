<?php

use App\Modules\NotificationManagement\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('notifications', [NotificationController::class, 'index'])->middleware('permission:notifications.view');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead'])->middleware('permission:notifications.manage');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markRead'])->middleware('permission:notifications.manage');
});
