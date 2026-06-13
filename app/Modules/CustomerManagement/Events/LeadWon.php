<?php

namespace App\Modules\CustomerManagement\Events;

use App\Modules\LeadManagement\Models\Lead;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadWon
{
    use Dispatchable, SerializesModels;

    public function __construct(public Lead $lead)
    {
    }
}
