<?php

namespace App\Providers;

use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AppServiceProvider extends ServiceProvider
{
    private const PRIVILEGED_ROLES = ['super-admin', 'administrator'];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function (User $user): bool|null {
            return $user->roles->pluck('name')->intersect(self::PRIVILEGED_ROLES)->isNotEmpty() ? true : null;
        });

        Permission::created(function (): void {
            $this->syncPrivilegedRolePermissions();
        });

        $this->syncPrivilegedRolePermissions();
    }

    private function syncPrivilegedRolePermissions(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = Permission::all();

        foreach (self::PRIVILEGED_ROLES as $roleName) {
            $role = Role::query()
                ->where('name', $roleName)
                ->where('guard_name', 'web')
                ->first();

            if (! $role) {
                continue;
            }

            $role->syncPermissions($permissions);
        }

        $admin = User::where('email', 'admin@example.com')->first();

        if ($admin) {
            foreach (self::PRIVILEGED_ROLES as $roleName) {
                $role = Role::query()
                    ->where('name', $roleName)
                    ->where('guard_name', 'web')
                    ->first();

                if ($role && ! $admin->hasRole($role)) {
                    $admin->assignRole($role);
                }
            }
        }
    }
}
