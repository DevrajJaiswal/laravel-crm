<?php

namespace App\Modules\LeadManagement\Services;

use App\Models\User;
use App\Modules\LeadManagement\Models\Lead;
use App\Modules\CustomerManagement\Events\LeadWon;
use App\Modules\NotificationManagement\Services\NotificationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeadService
{
    public function __construct(
        private NotificationService $notifications
    ) {}

    public function list(int $perPage = 10): LengthAwarePaginator
    {
        return Lead::query()
            ->with('owner')
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data, User $owner): Lead
    {
        return Lead::create([
            ...$data,
            'owner_id' => $owner->id,
        ])->load('owner');
    }

    public function update(Lead $lead, array $data): Lead
    {
        $wasWon = $lead->status === 'Won';

        $lead->update($data);

        $lead->refresh()->load('owner');

        if (! $wasWon && $lead->status === 'Won') {
            LeadWon::dispatchIf(! $lead->converted_customer_id, $lead);
            if ($lead->owner) {
                $this->notifications->create($lead->owner, [
                    'type' => 'lead.won',
                    'title' => 'Lead won',
                    'message' => sprintf('Lead "%s" was marked as won.', $lead->title),
                    'link' => "/leads/{$lead->id}",
                    'data' => [
                        'lead_id' => $lead->id,
                    ],
                ]);
            }
        }

        return $lead;
    }

    public function delete(Lead $lead): void
    {
        $lead->delete();
    }

    public function payload(Lead $lead): array
    {
        return [
            'id' => $lead->id,
            'title' => $lead->title,
            'company_name' => $lead->company_name,
            'contact_name' => $lead->contact_name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'source' => $lead->source,
            'status' => $lead->status,
            'value' => $lead->value,
            'notes' => $lead->notes,
            'owner' => $lead->owner ? [
                'id' => $lead->owner->id,
                'name' => $lead->owner->name,
                'email' => $lead->owner->email,
            ] : null,
            'converted_customer_id' => $lead->converted_customer_id,
            'created_at' => $lead->created_at?->toDateTimeString(),
            'updated_at' => $lead->updated_at?->toDateTimeString(),
        ];
    }
}
