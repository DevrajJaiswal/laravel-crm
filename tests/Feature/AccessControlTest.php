<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_roles_index_returns_roles(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $response = $this->getJson('/api/access-control/roles');

        $response->assertOk()
            ->assertJsonStructure([
                'roles',
            ]);
    }

    public function test_role_can_be_created_and_updated_with_permissions(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $permission = Permission::create([
            'name' => 'users.view',
            'guard_name' => 'web',
        ]);

        $createResponse = $this->postJson('/api/access-control/roles', [
            'name' => 'Manager',
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('role.name', 'Manager');

        $roleId = $createResponse->json('role.id');

        $syncResponse = $this->putJson("/api/access-control/roles/{$roleId}/permissions", [
            'permissions' => [$permission->id],
        ]);

        $syncResponse->assertOk()
            ->assertJsonPath('role.permissions.0', 'users.view');
    }
}
