<?php

use App\Modules\SupportTicketManagement\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('tickets/customers/{customer}/contacts', [TicketController::class, 'contacts']);
    Route::get('tickets/customers', [TicketController::class, 'customers']);
    Route::get('tickets/assignees', [TicketController::class, 'assignees']);
    Route::get('tickets', [TicketController::class, 'index']);
    Route::post('tickets', [TicketController::class, 'store']);
    Route::get('tickets/{ticket}', [TicketController::class, 'show']);
    Route::put('tickets/{ticket}', [TicketController::class, 'update']);
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy']);
});
