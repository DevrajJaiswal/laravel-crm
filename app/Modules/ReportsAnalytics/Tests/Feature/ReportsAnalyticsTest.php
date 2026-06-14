<?php

namespace Tests\Feature;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\LeadManagement\Models\Lead;
use App\Modules\DealManagement\Models\Deal;
use App\Modules\SupportTicketManagement\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportsAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_reports_summary_returns_crm_metrics(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $customer = Customer::create([
            'name' => 'Report Customer',
            'company_name' => 'Analytics Ltd',
            'email' => 'report@analytics.test',
            'phone' => '555-1212',
            'status' => 'Active',
            'industry' => 'Technology',
            'billing_address' => '123 Analytics Blvd',
            'shipping_address' => '123 Analytics Blvd',
            'notes' => 'Report customer',
            'owner_id' => $user->id,
        ]);

        Lead::create([
            'title' => 'Report Lead',
            'company_name' => 'Analytics Ltd',
            'contact_name' => 'Alice Analyst',
            'email' => 'alice@analytics.test',
            'phone' => '555-3434',
            'source' => 'Referral',
            'status' => 'New',
            'value' => 2500,
            'notes' => 'High priority',
            'owner_id' => $user->id,
        ]);

        Deal::create([
            'customer_id' => $customer->id,
            'owner_id' => $user->id,
            'title' => 'Report Deal',
            'amount' => 15000,
            'stage' => 'Prospecting',
            'probability' => 30,
            'expected_close_date' => now()->format('Y-m-d'),
            'notes' => 'Report deal',
        ]);

        Ticket::create([
            'customer_id' => $customer->id,
            'contact_id' => null,
            'assigned_to_user_id' => $user->id,
            'subject' => 'Report ticket',
            'description' => 'Ticket for reporting',
            'status' => 'Open',
            'priority' => 'Medium',
            'resolution_notes' => null,
            'closed_at' => null,
        ]);

        $response = $this->getJson('/api/reports/summary');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'leads' => ['total', 'by_status'],
                    'customers' => ['total', 'by_status'],
                    'deals' => ['total', 'value_total', 'by_stage'],
                    'tickets' => ['total', 'by_status'],
                ],
            ])
            ->assertJsonPath('data.leads.total', 1)
            ->assertJsonPath('data.customers.total', 1)
            ->assertJsonPath('data.deals.total', 1)
            ->assertJsonPath('data.tickets.total', 1);
    }
}

