<?php

namespace App\Modules\Setup\Controllers\Api;

use App\Modules\Setup\Services\SystemHealthService;
use Illuminate\Http\JsonResponse;

class HealthCheckController
{
    public function __invoke(SystemHealthService $healthService): JsonResponse
    {
        return response()->json($healthService->status());
    }
}
