<?php

namespace App\Modules\AccessControl\Database\Seeders;

use App\Modules\Users\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccessControlSeeder extends Seeder
{
    private const PRIVILEGED_ROLES = ['super-admin', 'administrator'];

    public function run(): void
    {
        $permissions = [
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
            'notifications.view',
            'notifications.manage',
            'reports.view',
            'data-transfer.import',
            'data-transfer.export',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $permissions = Permission::all();

        foreach (self::PRIVILEGED_ROLES as $roleName) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($permissions);
        }

        $admin = User::where('email', 'admin@example.com')->first();

        if ($admin) {
            foreach (self::PRIVILEGED_ROLES as $roleName) {
                $role = Role::findOrCreate($roleName, 'web');
                $admin->assignRole($role);
            }
        }
    }
}

