<?php

namespace App\Modules\SupportTicketManagement\Controllers\Api;

use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\SupportTicketManagement\Models\Ticket;
use App\Modules\SupportTicketManagement\Requests\StoreTicketRequest;
use App\Modules\SupportTicketManagement\Requests\UpdateTicketRequest;
use App\Modules\SupportTicketManagement\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController
{
    public function __construct(
        private TicketService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tickets = $this->service->list((int) $request->get('per_page', 10));

        return response()->json([
            'data' => collect($tickets->items())->map(fn (Ticket $ticket) => $this->service->payload($ticket)),
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ],
        ]);
    }

    public function customers(): JsonResponse
    {
        return response()->json([
            'data' => $this->service->customers(),
        ]);
    }

    public function contacts(Customer $customer): JsonResponse
    {
        return response()->json([
            'data' => $this->service->contacts($customer),
        ]);
    }

    public function assignees(): JsonResponse
    {
        return response()->json([
            'data' => $this->service->assignees(),
        ]);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        return response()->json($this->service->payload($ticket->load(['customer', 'contact', 'assignedTo'])));
    }

    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = $this->service->create($request->validated());

        return response()->json([
            'message' => 'Ticket created',
            'ticket' => $this->service->payload($ticket),
        ], 201);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $ticket = $this->service->update($ticket, $request->validated());

        return response()->json([
            'message' => 'Ticket updated',
            'ticket' => $this->service->payload($ticket),
        ]);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        $this->service->delete($ticket);

        return response()->json([
            'message' => 'Ticket deleted',
        ]);
    }
}
