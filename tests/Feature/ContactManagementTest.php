<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContactManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_contacts_for_a_customer(): void
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

        Contact::create([
            'customer_id' => $customer->id,
            'first_name' => 'Sara',
            'last_name' => 'Stone',
            'email' => 'sara@example.com',
            'phone' => '9998887777',
            'job_title' => 'Manager',
            'is_primary' => true,
            'notes' => 'Decision maker',
        ]);

        $response = $this->getJson("/api/customers/{$customer->id}/contacts");

        $response->assertOk()
            ->assertJsonPath('data.0.name', 'Sara Stone');
    }

    public function test_authenticated_user_can_create_contact_for_customer(): void
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

        $response = $this->postJson("/api/customers/{$customer->id}/contacts", [
            'first_name' => 'Sara',
            'last_name' => 'Stone',
            'email' => 'sara@example.com',
            'phone' => '9998887777',
            'job_title' => 'Manager',
            'is_primary' => true,
            'notes' => 'Decision maker',
        ]);

        $response->assertCreated()
            ->assertJsonPath('contact.name', 'Sara Stone');

        $this->assertDatabaseHas('contacts', [
            'customer_id' => $customer->id,
            'email' => 'sara@example.com',
            'is_primary' => 1,
        ]);
    }

    public function test_authenticated_user_can_update_contact(): void
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

        $response = $this->putJson("/api/contacts/{$contact->id}", [
            'first_name' => 'Sarah',
            'last_name' => 'Cole',
            'email' => 'sarah@example.com',
            'phone' => '1231231234',
            'job_title' => 'Director',
            'is_primary' => false,
            'notes' => 'Updated contact',
        ]);

        $response->assertOk()
            ->assertJsonPath('contact.name', 'Sarah Cole');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'first_name' => 'Sarah',
            'is_primary' => 0,
        ]);
    }

    public function test_authenticated_user_can_delete_contact(): void
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

        $response = $this->deleteJson("/api/contacts/{$contact->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Contact deleted');

        $this->assertDatabaseMissing('contacts', [
            'id' => $contact->id,
        ]);
    }
}
