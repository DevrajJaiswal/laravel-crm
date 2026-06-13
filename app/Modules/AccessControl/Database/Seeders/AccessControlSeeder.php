<?php

namespace App\Modules\AccessControl\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccessControlSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'access-control.view',
            'access-control.manage',
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $superAdmin = Role::findOrCreate('super-admin', 'web');
        $superAdmin->syncPermissions(Permission::all());

        $admin = User::where('email', 'admin@example.com')->first();

        if ($admin) {
            $admin->assignRole($superAdmin);
        }
    }
}
