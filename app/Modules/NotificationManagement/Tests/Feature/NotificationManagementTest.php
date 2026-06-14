<?php

namespace Tests\Feature;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\SupportTicketManagement\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_notifications_after_assigned_ticket_is_created(): void
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

        $this->postJson('/api/tickets', [
            'customer_id' => $customer->id,
            'contact_id' => null,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue',
            'description' => 'Customer cannot log in',
            'status' => 'Open',
            'priority' => 'High',
            'resolution_notes' => null,
        ])->assertCreated();

        $response = $this->getJson('/api/notifications');

        $response->assertOk()
            ->assertJsonPath('unread_count', 1)
            ->assertJsonPath('data.0.title', 'New ticket assigned');
    }

    public function test_user_can_mark_notification_as_read(): void
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

        $this->postJson('/api/tickets', [
            'customer_id' => $customer->id,
            'contact_id' => null,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue',
            'description' => 'Customer cannot log in',
            'status' => 'Open',
            'priority' => 'High',
            'resolution_notes' => null,
        ])->assertCreated();

        $notification = $this->getJson('/api/notifications')->json('data.0');

        $response = $this->postJson("/api/notifications/{$notification['id']}/read");

        $response->assertOk()
            ->assertJsonPath('notification.id', $notification['id']);

        $this->assertNotNull($response->json('notification.read_at'));
    }
}

