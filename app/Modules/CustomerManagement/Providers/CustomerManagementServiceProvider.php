<?php

namespace App\Modules\CustomerManagement\Providers;

use App\Modules\CustomerManagement\Events\LeadWon;
use App\Modules\CustomerManagement\Listeners\CreateCustomerFromWonLead;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class CustomerManagementServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Routes/api.php');
        Event::listen(LeadWon::class, CreateCustomerFromWonLead::class);
    }
}
