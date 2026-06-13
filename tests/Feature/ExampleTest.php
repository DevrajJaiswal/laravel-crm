<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_setup_dashboard_loads_successfully(): void
    {
        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertSee('Laravel CRM', false)
            ->assertSee('id="app"', false);
    }

    public function test_the_health_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/health');

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'ok',
                'application' => config('app.name'),
            ]);
    }
}
