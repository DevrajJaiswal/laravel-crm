<?php

namespace App\Modules\ReportsAnalytics\Services;

use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\LeadManagement\Models\Lead;
use App\Modules\DealManagement\Models\Deal;
use App\Modules\SupportTicketManagement\Models\Ticket;

class ReportService
{
    public function summary(): array
    {
        return [
            'leads' => [
                'total' => Lead::count(),
                'by_status' => Lead::query()
                    ->select('status')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status')
                    ->toArray(),
            ],
            'customers' => [
                'total' => Customer::count(),
                'by_status' => Customer::query()
                    ->select('status')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status')
                    ->toArray(),
            ],
            'deals' => [
                'total' => Deal::count(),
                'value_total' => Deal::sum('amount'),
                'by_stage' => Deal::query()
                    ->select('stage')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('stage')
                    ->pluck('count', 'stage')
                    ->toArray(),
            ],
            'tickets' => [
                'total' => Ticket::count(),
                'by_status' => Ticket::query()
                    ->select('status')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status')
                    ->toArray(),
            ],
        ];
    }
}
