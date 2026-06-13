<?php

namespace App\Modules\CustomerManagement\Controllers\Api;

use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\CustomerManagement\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController
{
    public function __construct(
        private CustomerService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $customers = $this->service->list((int) $request->get('per_page', 10));

        return response()->json([
            'data' => collect($customers->items())->map(fn (Customer $customer) => $this->service->payload($customer)),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
            ],
        ]);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json($this->service->payload($customer->load('owner')));
    }
}
