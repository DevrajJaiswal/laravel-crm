<?php

namespace App\Modules\CustomerManagement\Services;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\LeadManagement\Models\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerService
{
    public function list(int $perPage = 10): LengthAwarePaginator
    {
        return Customer::query()
            ->with('owner')
            ->latest()
            ->paginate($perPage);
    }

    public function payload(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'company_name' => $customer->company_name,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'status' => $customer->status,
            'industry' => $customer->industry,
            'billing_address' => $customer->billing_address,
            'shipping_address' => $customer->shipping_address,
            'notes' => $customer->notes,
            'owner' => $customer->owner ? [
                'id' => $customer->owner->id,
                'name' => $customer->owner->name,
                'email' => $customer->owner->email,
            ] : null,
            'converted_from_lead_id' => $customer->converted_from_lead_id,
            'created_at' => $customer->created_at?->toDateTimeString(),
            'updated_at' => $customer->updated_at?->toDateTimeString(),
        ];
    }

    public function create(array $data, User $owner): Customer
    {
        return Customer::create([
            ...$data,
            'owner_id' => $owner->id,
        ])->load('owner');
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer->refresh()->load('owner');
    }

    public function createFromLead(Lead $lead): Customer
    {
        return Customer::create([
            'name' => $lead->contact_name,
            'company_name' => $lead->company_name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'status' => 'Active',
            'industry' => null,
            'billing_address' => null,
            'shipping_address' => null,
            'notes' => $lead->notes ? 'Converted from lead: '.$lead->notes : 'Converted from won lead',
            'owner_id' => $lead->owner_id,
            'converted_from_lead_id' => $lead->id,
        ])->load('owner');
    }
}

