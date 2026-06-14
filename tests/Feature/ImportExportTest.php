<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\ImportExport\Models\Import;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Modules\ImportExport\Jobs\ProcessImportJob;
use App\Modules\CustomerManagement\Models\Customer;

class ImportExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_customers_csv_import_processes_rows(): void
    {
        $actor = User::factory()->create();
        $this->actingAs($actor, 'sanctum');

        $dir = storage_path('app/imports');
        if (! is_dir($dir)) mkdir($dir, 0755, true);
        file_put_contents(storage_path('app/imports/test_customers.csv'), "name,company_name,email,phone\nJohn Doe,Acme Corp,john@acme.test,12345\nJane Roe,Blue Ltd,jane@blue.test,67890\n");

        $import = Import::create([
            'user_id' => $actor->id,
            'model' => 'customers',
            'filename' => 'imports/test_customers.csv',
            'status' => 'queued',
        ]);

        // Process synchronously
        (new ProcessImportJob($import->id))->handle();

        $import->refresh();
        if ($import->errors) {
            file_put_contents('php://stderr', "Import errors: " . print_r($import->errors, true));
        }

        $this->assertContains($import->status, ['completed', 'completed_with_errors']);
        $this->assertEquals(2, $import->rows_total);

        $this->assertDatabaseHas('customers', ['email' => 'john@acme.test']);
        $this->assertDatabaseHas('customers', ['email' => 'jane@blue.test']);
    }

    public function test_export_csv_returns_customer_data(): void
    {
        $actor = User::factory()->create();
        Customer::create([
            'name' => 'Export Test',
            'company_name' => 'Export Inc',
            'email' => 'export@test.local',
            'phone' => '555-1212',
            'owner_id' => $actor->id,
        ]);

        $this->actingAs($actor, 'sanctum');

        $response = $this->postJson('/api/exports', [
            'model' => 'customers',
            'format' => 'csv',
        ]);

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
        $content = $response->streamedContent();

        $this->assertStringContainsString('name,company_name,email,phone', $content);
        $this->assertStringContainsString('Export Test', $content);
        $this->assertStringContainsString('Export Inc', $content);
        $this->assertStringContainsString('export@test.local', $content);
    }

    public function test_export_history_index_returns_export_records(): void
    {
        $actor = User::factory()->create();
        Customer::create([
            'name' => 'Export History Test',
            'company_name' => 'History Inc',
            'email' => 'history@test.local',
            'phone' => '555-3434',
            'owner_id' => $actor->id,
        ]);

        $this->actingAs($actor, 'sanctum');

        $this->postJson('/api/exports', [
            'model' => 'customers',
            'format' => 'csv',
        ])->assertStatus(200);

        $response = $this->getJson('/api/exports');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => [['id', 'model', 'format', 'status', 'rows_total', 'rows_exported', 'created_at', 'updated_at']]]);
        $this->assertEquals('customers', $response->json('data.0.model'));
        $this->assertEquals('csv', $response->json('data.0.format'));
    }
}
