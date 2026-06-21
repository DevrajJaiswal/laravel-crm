<?php

use App\Modules\SupportTicketManagement\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api', 'auth:sanctum'])->prefix('api')->group(function () {
    Route::get('tickets/customers/{customer}/contacts', [TicketController::class, 'contacts'])->middleware('permission:tickets.view');
    Route::get('tickets/customers', [TicketController::class, 'customers'])->middleware('permission:tickets.view');
    Route::get('tickets/assignees', [TicketController::class, 'assignees'])->middleware('permission:tickets.create');
    Route::get('tickets', [TicketController::class, 'index'])->middleware('permission:tickets.view');
    Route::post('tickets', [TicketController::class, 'store'])->middleware('permission:tickets.create');
    Route::get('tickets/{ticket}', [TicketController::class, 'show'])->middleware('permission:tickets.view');
    Route::put('tickets/{ticket}', [TicketController::class, 'update'])->middleware('permission:tickets.update');
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy'])->middleware('permission:tickets.delete');
});
