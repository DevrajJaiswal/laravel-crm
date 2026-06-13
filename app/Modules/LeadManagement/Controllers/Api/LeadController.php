<?php

namespace App\Modules\LeadManagement\Controllers\Api;

use App\Modules\LeadManagement\Models\Lead;
use App\Modules\LeadManagement\Requests\StoreLeadRequest;
use App\Modules\LeadManagement\Requests\UpdateLeadRequest;
use App\Modules\LeadManagement\Services\LeadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController
{
    public function __construct(
        private LeadService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $leads = $this->service->list((int) $request->get('per_page', 10));

        return response()->json([
            'data' => collect($leads->items())->map(fn (Lead $lead) => $this->service->payload($lead)),
            'meta' => [
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
                'per_page' => $leads->perPage(),
                'total' => $leads->total(),
            ],
        ]);
    }

    public function show(Lead $lead): JsonResponse
    {
        return response()->json($this->service->payload($lead->load('owner')));
    }

    public function store(StoreLeadRequest $request): JsonResponse
    {
        $lead = $this->service->create($request->validated(), $request->user());

        return response()->json([
            'message' => 'Lead created',
            'lead' => $this->service->payload($lead),
        ], 201);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): JsonResponse
    {
        $lead = $this->service->update($lead, $request->validated());

        return response()->json([
            'message' => 'Lead updated',
            'lead' => $this->service->payload($lead),
        ]);
    }

    public function destroy(Lead $lead): JsonResponse
    {
        $this->service->delete($lead);

        return response()->json(['message' => 'Lead deleted']);
    }
}
