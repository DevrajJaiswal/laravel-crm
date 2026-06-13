<?php

namespace App\Modules\LeadManagement\Services;

use App\Models\User;
use App\Modules\LeadManagement\Models\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LeadService
{
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
        $lead->update($data);

        return $lead->refresh()->load('owner');
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
            'created_at' => $lead->created_at?->toDateTimeString(),
            'updated_at' => $lead->updated_at?->toDateTimeString(),
        ];
    }
}
