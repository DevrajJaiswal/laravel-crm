<?php

namespace Tests\Feature;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\DealManagement\Models\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DealManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_pipeline(): void
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

        Deal::create([
            'customer_id' => $customer->id,
            'owner_id' => $actor->id,
            'title' => 'Website Redesign',
            'amount' => 5000,
            'stage' => 'Proposal',
            'probability' => 60,
            'expected_close_date' => now()->addDays(14)->toDateString(),
            'notes' => 'Proposal sent',
        ]);

        $response = $this->getJson('/api/deals');

        $response->assertOk()
            ->assertJsonPath('data.Proposal.0.title', 'Website Redesign');
    }

    public function test_authenticated_user_can_create_a_deal(): void
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

        $response = $this->postJson('/api/deals', [
            'customer_id' => $customer->id,
            'title' => 'Website Redesign',
            'amount' => 5000,
            'stage' => 'Proposal',
            'probability' => 60,
            'expected_close_date' => now()->addDays(14)->toDateString(),
            'notes' => 'Proposal sent',
        ]);

        $response->assertCreated()
            ->assertJsonPath('deal.title', 'Website Redesign');

        $this->assertDatabaseHas('deals', [
            'customer_id' => $customer->id,
            'title' => 'Website Redesign',
        ]);
    }

    public function test_authenticated_user_can_update_a_deal_stage(): void
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

        $deal = Deal::create([
            'customer_id' => $customer->id,
            'owner_id' => $actor->id,
            'title' => 'Website Redesign',
            'amount' => 5000,
            'stage' => 'Proposal',
            'probability' => 60,
            'expected_close_date' => now()->addDays(14)->toDateString(),
            'notes' => 'Proposal sent',
        ]);

        $response = $this->putJson("/api/deals/{$deal->id}", [
            'customer_id' => $customer->id,
            'title' => 'Website Redesign',
            'amount' => 5000,
            'stage' => 'Won',
            'probability' => 90,
            'expected_close_date' => now()->addDays(14)->toDateString(),
            'notes' => 'Proposal accepted',
        ]);

        $response->assertOk()
            ->assertJsonPath('deal.stage', 'Won');

        $this->assertDatabaseHas('deals', [
            'id' => $deal->id,
            'stage' => 'Won',
        ]);
    }

    public function test_authenticated_user_can_delete_a_deal(): void
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

        $deal = Deal::create([
            'customer_id' => $customer->id,
            'owner_id' => $actor->id,
            'title' => 'Website Redesign',
            'amount' => 5000,
            'stage' => 'Proposal',
            'probability' => 60,
            'expected_close_date' => now()->addDays(14)->toDateString(),
            'notes' => 'Proposal sent',
        ]);

        $response = $this->deleteJson("/api/deals/{$deal->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Deal deleted');

        $this->assertDatabaseMissing('deals', [
            'id' => $deal->id,
        ]);
    }
}

