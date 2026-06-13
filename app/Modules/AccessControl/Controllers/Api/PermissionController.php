<?php

namespace App\Modules\AccessControl\Controllers\Api;

use App\Modules\AccessControl\Services\AccessControlService;
use Illuminate\Http\JsonResponse;

class PermissionController
{
    public function __construct(
        private AccessControlService $service
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'permissions' => $this->service->permissions(),
        ]);
    }
}
