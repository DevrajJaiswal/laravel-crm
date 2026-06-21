<?php

namespace App\Providers;

use App\Modules\Users\Models\User;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AppServiceProvider extends ServiceProvider
{
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
        Permission::created(function (): void {
            $this->syncSuperAdminPermissions();
        });

        $this->syncSuperAdminPermissions();
    }

    private function syncSuperAdminPermissions(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $superAdmin = Role::findByName('super-admin', 'web');

        if ($superAdmin) {
            $superAdmin->syncPermissions(Permission::all());

            $admin = User::where('email', 'admin@example.com')->first();

            if ($admin && ! $admin->hasRole($superAdmin)) {
                $admin->assignRole($superAdmin);
            }
        }
    }
}
