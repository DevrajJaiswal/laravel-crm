<?php

namespace Tests\Feature;

use App\Models\User;
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
}
