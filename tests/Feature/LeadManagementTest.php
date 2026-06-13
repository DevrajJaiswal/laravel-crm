<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\LeadManagement\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LeadManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_leads(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        Lead::create([
            'title' => 'Website Inquiry',
            'company_name' => 'Acme Inc',
            'contact_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '1234567890',
            'source' => 'Website',
            'status' => 'New',
            'value' => 1000,
            'notes' => 'Hot lead',
            'owner_id' => $actor->id,
        ]);

        $response = $this->getJson('/api/leads');

        $response->assertOk()
            ->assertJsonPath('data.0.title', 'Website Inquiry');
    }

    public function test_authenticated_user_can_create_update_and_delete_lead(): void
    {
        $actor = User::factory()->create();
        Sanctum::actingAs($actor);

        $createResponse = $this->postJson('/api/leads', [
            'title' => 'Conference Follow-up',
            'company_name' => 'Nova Labs',
            'contact_name' => 'Mark Smith',
            'email' => 'mark@example.com',
            'phone' => '9998887777',
            'source' => 'Referral',
            'status' => 'New',
            'value' => 2500,
            'notes' => 'Needs demo',
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('lead.title', 'Conference Follow-up');

        $leadId = $createResponse->json('lead.id');

        $updateResponse = $this->putJson("/api/leads/{$leadId}", [
            'title' => 'Conference Follow-up Updated',
            'company_name' => 'Nova Labs',
            'contact_name' => 'Mark Smith',
            'email' => 'mark@example.com',
            'phone' => '9998887777',
            'source' => 'Referral',
            'status' => 'Qualified',
            'value' => 3000,
            'notes' => 'Demo scheduled',
        ]);

        $updateResponse->assertOk()
            ->assertJsonPath('lead.status', 'Qualified');

        $deleteResponse = $this->deleteJson("/api/leads/{$leadId}");

        $deleteResponse->assertOk()
            ->assertJsonPath('message', 'Lead deleted');

        $this->assertDatabaseMissing('leads', [
            'id' => $leadId,
        ]);
    }
}
