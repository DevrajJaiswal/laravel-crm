<?php

namespace App\Modules\AccessControl\Services;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccessControlService
{
    public function roles(): Collection
    {
        return Role::query()
            ->with('permissions')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => $this->rolePayload($role));
    }

    public function permissions(): Collection
    {
        return Permission::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $permission) => $this->permissionPayload($permission));
    }

    public function role(Role $role): array
    {
        $role->load('permissions');

        return [
            'role' => $this->rolePayload($role),
            'permissions' => $this->permissions(),
            'selected_permission_ids' => $role->permissions->pluck('id')->values(),
        ];
    }

    public function createRole(array $data): Role
    {
        return Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);
    }

    public function updateRole(Role $role, array $data): Role
    {
        $role->update([
            'name' => $data['name'],
        ]);

        return $role->refresh()->load('permissions');
    }

    public function deleteRole(Role $role): void
    {
        $role->delete();
    }

    public function syncPermissions(Role $role, array $permissionIds): Role
    {
        $role->syncPermissions($permissionIds);

        return $role->refresh()->load('permissions');
    }

    public function rolePayload(Role $role): array
    {
        return [
            'id' => $role->id,
            'name' => $role->name,
            'permissions' => $role->permissions->pluck('name')->values(),
            'permission_count' => $role->permissions->count(),
        ];
    }

    public function permissionPayload(Permission $permission): array
    {
        return [
            'id' => $permission->id,
            'name' => $permission->name,
        ];
    }
}
