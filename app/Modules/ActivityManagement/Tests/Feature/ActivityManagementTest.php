<?php

namespace Tests\Feature;

use App\Modules\Users\Models\User;
use App\Modules\ActivityManagement\Models\Activity;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ActivityManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_customer_activities(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $customer = Customer::create([
            'name' => 'Jane Client',
            'company_name' => 'Bluebird Ltd',
            'email' => 'jane@example.com',
            'phone' => '1112223333',
            'status' => 'Active',
            'industry' => 'Retail',
            'billing_address' => 'Street 1',
            'shipping_address' => 'Street 1',
            'notes' => 'Important account',
            'owner_id' => $actor->id,
        ]);

        Activity::create([
            'customer_id' => $customer->id,
            'user_id' => $actor->id,
            'type' => 'Call',
            'subject' => 'Intro call',
            'notes' => 'Discussed requirements',
            'occurred_at' => now(),
        ]);

        $response = $this->getJson("/api/customers/{$customer->id}/activities");

        $response->assertOk()
            ->assertJsonPath('data.0.subject', 'Intro call');
    }

    public function test_authenticated_user_can_create_activity_for_customer(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $customer = Customer::create([
            'name' => 'Jane Client',
            'company_name' => 'Bluebird Ltd',
            'email' => 'jane@example.com',
            'phone' => '1112223333',
            'status' => 'Active',
            'industry' => 'Retail',
            'billing_address' => 'Street 1',
            'shipping_address' => 'Street 1',
            'notes' => 'Important account',
            'owner_id' => $actor->id,
        ]);

        $response = $this->postJson("/api/customers/{$customer->id}/activities", [
            'type' => 'Meeting',
            'subject' => 'Discovery meeting',
            'notes' => 'Met with procurement',
            'occurred_at' => now()->toDateTimeString(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('activity.subject', 'Discovery meeting');

        $this->assertDatabaseHas('activities', [
            'customer_id' => $customer->id,
            'type' => 'Meeting',
            'subject' => 'Discovery meeting',
        ]);
    }

    public function test_authenticated_user_can_update_activity(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $customer = Customer::create([
            'name' => 'Jane Client',
            'company_name' => 'Bluebird Ltd',
            'email' => 'jane@example.com',
            'phone' => '1112223333',
            'status' => 'Active',
            'industry' => 'Retail',
            'billing_address' => 'Street 1',
            'shipping_address' => 'Street 1',
            'notes' => 'Important account',
            'owner_id' => $actor->id,
        ]);

        $activity = Activity::create([
            'customer_id' => $customer->id,
            'user_id' => $actor->id,
            'type' => 'Call',
            'subject' => 'Intro call',
            'notes' => 'Discussed requirements',
            'occurred_at' => now(),
        ]);

        $response = $this->putJson("/api/activities/{$activity->id}", [
            'type' => 'Email',
            'subject' => 'Follow-up email',
            'notes' => 'Sent recap',
            'occurred_at' => now()->toDateTimeString(),
        ]);

        $response->assertOk()
            ->assertJsonPath('activity.type', 'Email');

        $this->assertDatabaseHas('activities', [
            'id' => $activity->id,
            'type' => 'Email',
            'subject' => 'Follow-up email',
        ]);
    }

    public function test_authenticated_user_can_delete_activity(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $customer = Customer::create([
            'name' => 'Jane Client',
            'company_name' => 'Bluebird Ltd',
            'email' => 'jane@example.com',
            'phone' => '1112223333',
            'status' => 'Active',
            'industry' => 'Retail',
            'billing_address' => 'Street 1',
            'shipping_address' => 'Street 1',
            'notes' => 'Important account',
            'owner_id' => $actor->id,
        ]);

        $activity = Activity::create([
            'customer_id' => $customer->id,
            'user_id' => $actor->id,
            'type' => 'Call',
            'subject' => 'Intro call',
            'notes' => 'Discussed requirements',
            'occurred_at' => now(),
        ]);

        $response = $this->deleteJson("/api/activities/{$activity->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Activity deleted');

        $this->assertDatabaseMissing('activities', [
            'id' => $activity->id,
        ]);
    }
}

