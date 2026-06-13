<?php

namespace App\Modules\CustomerManagement\Services;

use App\Modules\CustomerManagement\Models\Customer;
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
            'created_at' => $customer->created_at?->toDateTimeString(),
            'updated_at' => $customer->updated_at?->toDateTimeString(),
        ];
    }
}
