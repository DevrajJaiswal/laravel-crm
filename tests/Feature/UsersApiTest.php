<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UsersApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_update_a_user(): void
    {
        $actor = User::factory()->create();
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);

        Sanctum::actingAs($actor);

        $response = $this->putJson("/api/users/{$user->id}", [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

        $response->assertOk()
            ->assertJson([
                'message' => 'User updated',
                'user' => [
                    'name' => 'New Name',
                    'email' => 'new@example.com',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);
    }

    public function test_authenticated_user_can_delete_a_user(): void
    {
        $actor = User::factory()->create();
        $user = User::factory()->create();

        Sanctum::actingAs($actor);

        $response = $this->deleteJson("/api/users/{$user->id}");

        $response->assertOk()
            ->assertJson([
                'message' => 'User deleted',
            ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
}
