<?php

namespace Tests\Feature;

use App\Modules\Users\Models\User;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\SupportTicketManagement\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_tickets(): void
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

        $ticket = Ticket::create([
            'customer_id' => $customer->id,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue',
            'description' => 'Customer cannot log in',
            'status' => 'Open',
            'priority' => 'High',
        ]);

        $response = $this->getJson('/api/tickets');

        $response->assertOk()
            ->assertJsonPath('data.0.subject', 'Login issue');
    }

    public function test_authenticated_user_can_create_ticket(): void
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

        $contact = Contact::create([
            'customer_id' => $customer->id,
            'first_name' => 'Sara',
            'last_name' => 'Stone',
            'email' => 'sara@example.com',
            'phone' => '9998887777',
            'job_title' => 'Manager',
            'is_primary' => true,
            'notes' => 'Decision maker',
        ]);

        $response = $this->postJson('/api/tickets', [
            'customer_id' => $customer->id,
            'contact_id' => $contact->id,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue',
            'description' => 'Customer cannot log in',
            'status' => 'Open',
            'priority' => 'High',
            'resolution_notes' => null,
        ]);

        $response->assertCreated()
            ->assertJsonPath('ticket.subject', 'Login issue');

        $this->assertDatabaseHas('tickets', [
            'customer_id' => $customer->id,
            'subject' => 'Login issue',
        ]);
    }

    public function test_authenticated_user_can_update_ticket(): void
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

        $ticket = Ticket::create([
            'customer_id' => $customer->id,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue',
            'description' => 'Customer cannot log in',
            'status' => 'Open',
            'priority' => 'High',
        ]);

        $response = $this->putJson("/api/tickets/{$ticket->id}", [
            'customer_id' => $customer->id,
            'contact_id' => null,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue updated',
            'description' => 'Updated description',
            'status' => 'Resolved',
            'priority' => 'Medium',
            'resolution_notes' => 'Issue fixed',
        ]);

        $response->assertOk()
            ->assertJsonPath('ticket.status', 'Resolved');

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'subject' => 'Login issue updated',
            'status' => 'Resolved',
        ]);
    }

    public function test_authenticated_user_can_delete_ticket(): void
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

        $ticket = Ticket::create([
            'customer_id' => $customer->id,
            'assigned_to_user_id' => $actor->id,
            'subject' => 'Login issue',
            'description' => 'Customer cannot log in',
            'status' => 'Open',
            'priority' => 'High',
        ]);

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Ticket deleted');

        $this->assertDatabaseMissing('tickets', [
            'id' => $ticket->id,
        ]);
    }
}

