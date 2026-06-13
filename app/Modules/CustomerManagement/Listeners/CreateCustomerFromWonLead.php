<?php

namespace App\Modules\CustomerManagement\Listeners;

use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\CustomerManagement\Services\CustomerService;
use App\Modules\CustomerManagement\Events\LeadWon;

class CreateCustomerFromWonLead
{
    public function __construct(
        private CustomerService $service
    ) {}

    public function handle(LeadWon $event): void
    {
        $lead = $event->lead->loadMissing('owner');

        if ($lead->converted_customer_id) {
            return;
        }

        $customer = $this->service->createFromLead($lead);

        $lead->forceFill([
            'converted_customer_id' => $customer->id,
        ])->save();
    }
}
