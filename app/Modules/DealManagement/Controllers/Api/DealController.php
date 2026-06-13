<?php

namespace App\Modules\DealManagement\Controllers\Api;

use App\Modules\DealManagement\Models\Deal;
use App\Modules\DealManagement\Requests\StoreDealRequest;
use App\Modules\DealManagement\Requests\UpdateDealRequest;
use App\Modules\DealManagement\Services\DealService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealController
{
    public function __construct(
        private DealService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('pipeline', true)) {
            return response()->json([
                'stages' => Deal::STAGES,
                'data' => $this->service->pipeline(),
            ]);
        }

        $deals = $this->service->list((int) $request->get('per_page', 10));

        return response()->json([
            'data' => collect($deals->items())->map(fn (Deal $deal) => $this->service->payload($deal)),
            'meta' => [
                'current_page' => $deals->currentPage(),
                'last_page' => $deals->lastPage(),
                'per_page' => $deals->perPage(),
                'total' => $deals->total(),
            ],
        ]);
    }

    public function customers(): JsonResponse
    {
        return response()->json([
            'data' => $this->service->customers(),
        ]);
    }

    public function show(Deal $deal): JsonResponse
    {
        return response()->json($this->service->payload($deal->load(['customer', 'owner'])));
    }

    public function store(StoreDealRequest $request): JsonResponse
    {
        $deal = $this->service->create($request->validated(), $request->user());

        return response()->json([
            'message' => 'Deal created',
            'deal' => $this->service->payload($deal),
        ], 201);
    }

    public function update(UpdateDealRequest $request, Deal $deal): JsonResponse
    {
        $deal = $this->service->update($deal, $request->validated());

        return response()->json([
            'message' => 'Deal updated',
            'deal' => $this->service->payload($deal),
        ]);
    }

    public function destroy(Deal $deal): JsonResponse
    {
        $this->service->delete($deal);

        return response()->json([
            'message' => 'Deal deleted',
        ]);
    }
}
