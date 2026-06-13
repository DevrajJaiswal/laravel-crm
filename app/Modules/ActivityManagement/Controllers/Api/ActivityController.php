<?php

namespace App\Modules\ActivityManagement\Controllers\Api;

use App\Modules\ActivityManagement\Models\Activity;
use App\Modules\ActivityManagement\Requests\StoreActivityRequest;
use App\Modules\ActivityManagement\Requests\UpdateActivityRequest;
use App\Modules\ActivityManagement\Services\ActivityService;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Http\JsonResponse;

class ActivityController
{
    public function __construct(
        private ActivityService $service
    ) {}

    public function index(Customer $customer): JsonResponse
    {
        return response()->json([
            'data' => $this->service->listForCustomer($customer),
        ]);
    }

    public function store(StoreActivityRequest $request, Customer $customer): JsonResponse
    {
        $activity = $this->service->create($customer, $request->validated(), $request->user());

        return response()->json([
            'message' => 'Activity created',
            'activity' => $this->service->payload($activity),
        ], 201);
    }

    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $activity = $this->service->update($activity, $request->validated());

        return response()->json([
            'message' => 'Activity updated',
            'activity' => $this->service->payload($activity),
        ]);
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $this->service->delete($activity);

        return response()->json([
            'message' => 'Activity deleted',
        ]);
    }
}
