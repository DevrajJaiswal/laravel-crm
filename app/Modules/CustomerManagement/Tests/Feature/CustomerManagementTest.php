<?php

namespace Tests\Feature;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomerManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_customers(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        Customer::create([
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

        $response = $this->getJson('/api/customers');

        $response->assertOk()
            ->assertJsonPath('data.0.company_name', 'Bluebird Ltd');
    }

    public function test_authenticated_user_can_view_customer_details(): void
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

        $response = $this->getJson("/api/customers/{$customer->id}");

        $response->assertOk()
            ->assertJsonPath('company_name', 'Bluebird Ltd');
    }

    public function test_authenticated_user_can_create_a_customer(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $response = $this->postJson('/api/customers', [
            'name' => 'Manual Client',
            'company_name' => 'Manual Co',
            'email' => 'manual@example.com',
            'phone' => '4445556666',
            'status' => 'Active',
            'industry' => 'Technology',
            'billing_address' => 'Billing street',
            'shipping_address' => 'Shipping street',
            'notes' => 'Created manually',
        ]);

        $response->assertCreated()
            ->assertJsonPath('customer.name', 'Manual Client');

        $this->assertDatabaseHas('customers', [
            'company_name' => 'Manual Co',
            'email' => 'manual@example.com',
        ]);
    }

    public function test_authenticated_user_can_update_a_customer(): void
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

        $response = $this->putJson("/api/customers/{$customer->id}", [
            'name' => 'Jane Updated',
            'company_name' => 'Bluebird Group',
            'email' => 'jane.updated@example.com',
            'phone' => '9998887777',
            'status' => 'Active',
            'industry' => 'Technology',
            'billing_address' => 'Billing 2',
            'shipping_address' => 'Shipping 2',
            'notes' => 'Updated account',
        ]);

        $response->assertOk()
            ->assertJsonPath('customer.name', 'Jane Updated')
            ->assertJsonPath('customer.billing_address', 'Billing 2');

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'company_name' => 'Bluebird Group',
            'billing_address' => 'Billing 2',
        ]);
    }
}

