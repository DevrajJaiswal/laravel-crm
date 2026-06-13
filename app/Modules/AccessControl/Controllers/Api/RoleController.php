<?php

namespace App\Modules\AccessControl\Controllers\Api;

use App\Modules\AccessControl\Requests\StoreRoleRequest;
use App\Modules\AccessControl\Requests\SyncRolePermissionsRequest;
use App\Modules\AccessControl\Requests\UpdateRoleRequest;
use App\Modules\AccessControl\Services\AccessControlService;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class RoleController
{
    public function __construct(
        private AccessControlService $service
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'roles' => $this->service->roles(),
        ]);
    }

    public function show(Role $role): JsonResponse
    {
        return response()->json($this->service->role($role));
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->service->createRole($request->validated());

        return response()->json([
            'message' => 'Role created',
            'role' => $this->service->rolePayload($role->load('permissions')),
        ], 201);
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        $role = $this->service->updateRole($role, $request->validated());

        return response()->json([
            'message' => 'Role updated',
            'role' => $this->service->rolePayload($role),
        ]);
    }

    public function destroy(Role $role): JsonResponse
    {
        $this->service->deleteRole($role);

        return response()->json(['message' => 'Role deleted']);
    }

    public function syncPermissions(SyncRolePermissionsRequest $request, Role $role): JsonResponse
    {
        $role = $this->service->syncPermissions($role, $request->validated('permissions'));

        return response()->json([
            'message' => 'Role permissions updated',
            'role' => $this->service->rolePayload($role),
        ]);
    }
}
