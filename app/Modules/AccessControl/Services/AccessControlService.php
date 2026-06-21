<?php

namespace App\Modules\AccessControl\Services;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccessControlService
{
    private const RESERVED_ROLES = ['super-admin', 'administrator'];

    private const PERMISSIONS = [
        'access-control.view',
        'access-control.manage',
        'users.view',
        'users.create',
        'users.update',
        'users.delete',
        'roles.view',
        'roles.create',
        'roles.update',
        'roles.delete',
        'settings.view',
        'settings.update',
        'leads.view',
        'leads.create',
        'leads.update',
        'leads.delete',
        'customers.view',
        'customers.create',
        'customers.update',
        'customers.delete',
        'contacts.view',
        'contacts.create',
        'contacts.update',
        'contacts.delete',
        'activities.view',
        'activities.create',
        'activities.update',
        'activities.delete',
        'deals.view',
        'deals.create',
        'deals.update',
        'deals.delete',
        'tickets.view',
        'tickets.create',
        'tickets.update',
        'tickets.delete',
        'reports.view',
        'data-transfer.import',
        'data-transfer.export',
    ];

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
        $this->ensurePermissionCatalog();

        return Permission::query()
            ->orderBy('name')
            ->get()
            ->reject(fn (Permission $permission) => ! $this->isVisiblePermission($permission->name))
            ->map(fn (Permission $permission) => $this->permissionPayload($permission));
    }

    public function role(Role $role): array
    {
        $role->load('permissions');
        $visiblePermissions = $role->permissions->reject(
            fn (Permission $permission) => ! $this->isVisiblePermission($permission->name)
        );

        return [
            'role' => $this->rolePayload($role),
            'permissions' => $this->permissions(),
            'selected_permission_ids' => $visiblePermissions->pluck('id')->values(),
        ];
    }

    public function createRole(array $data): Role
    {
        $name = trim($data['name']);
        $this->assertRoleIsMutable($name);

        return Role::create([
            'name' => $name,
            'guard_name' => 'web',
        ]);
    }

    public function updateRole(Role $role, array $data): Role
    {
        $this->assertRoleIsMutable($role->name);

        $role->update([
            'name' => $data['name'],
        ]);

        return $role->refresh()->load('permissions');
    }

    public function deleteRole(Role $role): void
    {
        $this->assertRoleIsMutable($role->name);

        $role->delete();
    }

    public function syncPermissions(Role $role, array $permissionIds): Role
    {
        $this->assertRoleIsMutable($role->name);

        $role->syncPermissions($permissionIds);

        return $role->refresh()->load('permissions');
    }

    public function rolePayload(Role $role): array
    {
        $visiblePermissions = $role->permissions->reject(
            fn (Permission $permission) => ! $this->isVisiblePermission($permission->name)
        );

        return [
            'id' => $role->id,
            'name' => $role->name,
            'is_reserved' => $this->isReservedRole($role->name),
            'role_type' => $this->isReservedRole($role->name) ? 'Administrator' : 'Custom',
            'permissions' => $visiblePermissions->pluck('name')->values(),
            'permission_count' => $visiblePermissions->count(),
            'permission_summary' => $this->permissionSummary($visiblePermissions),
        ];
    }

    public function permissionPayload(Permission $permission): array
    {
        return [
            'id' => $permission->id,
            'name' => $permission->name,
        ];
    }

    private function ensurePermissionCatalog(): void
    {
        foreach (self::PERMISSIONS as $permission) {
            Permission::findOrCreate($permission, 'web');
        }
    }

    private function isVisiblePermission(string $permission): bool
    {
        if (str_starts_with($permission, 'notifications.')) {
            return false;
        }

        return ! in_array($permission, ['manage-settings', 'manage-users', 'manage-roles'], true);
    }

    private function isReservedRole(string $name): bool
    {
        return in_array(strtolower($name), self::RESERVED_ROLES, true);
    }

    private function assertRoleIsMutable(string $name): void
    {
        if ($this->isReservedRole($name)) {
            abort(422, 'The Administrator role is reserved and cannot be changed.');
        }
    }

    private function permissionSummary(Collection $permissions): array
    {
        return $permissions
            ->groupBy(fn (Permission $permission) => $this->moduleLabel($permission->name))
            ->map(function (Collection $items, string $module) {
                $actions = $items
                    ->sortBy(fn (Permission $permission) => $this->permissionSortOrder($permission->name))
                    ->map(fn (Permission $permission) => $this->actionLabel($permission->name))
                    ->values()
                    ->all();

                return [
                    'module' => $module,
                    'actions' => $this->compactActions($actions),
                ];
            })
            ->values()
            ->all();
    }

    private function moduleLabel(string $permission): string
    {
        $segment = explode('.', $permission, 2)[0] ?? '';

        if (str_starts_with($segment, 'manage-')) {
            return ucfirst(str_replace('manage-', '', $segment));
        }

        return ucwords(str_replace(['-', '_'], ' ', $segment));
    }

    private function actionLabel(string $permission): string
    {
        if (! str_contains($permission, '.')) {
            return 'Manage';
        }

        return ucfirst(explode('.', $permission, 2)[1] ?? '');
    }

    private function permissionSortOrder(string $permission): int
    {
        $action = strtolower(explode('.', $permission, 2)[1] ?? '');

        return match ($action) {
            'view' => 1,
            'create' => 2,
            'update', 'edit' => 3,
            'delete' => 4,
            'import' => 5,
            'export' => 6,
            'manage' => 0,
            default => 99,
        };
    }

    private function compactActions(array $actions): string
    {
        $normalized = array_values(array_unique($actions));

        if ($normalized === ['View', 'Create', 'Update', 'Delete']) {
            return 'CRUD';
        }

        return implode(', ', $normalized);
    }
}
