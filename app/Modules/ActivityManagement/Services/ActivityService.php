<?php

namespace App\Modules\ActivityManagement\Services;

use App\Modules\Users\Models\User;
use App\Modules\ActivityManagement\Models\Activity;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Support\Collection;

class ActivityService
{
    public function listForCustomer(Customer $customer): Collection
    {
        return $customer->activities()
            ->with('user')
            ->latest('occurred_at')
            ->get()
            ->map(fn (Activity $activity) => $this->payload($activity));
    }

    public function payload(Activity $activity): array
    {
        return [
            'id' => $activity->id,
            'customer_id' => $activity->customer_id,
            'type' => $activity->type,
            'subject' => $activity->subject,
            'notes' => $activity->notes,
            'occurred_at' => $activity->occurred_at?->toDateTimeString(),
            'user' => $activity->user ? [
                'id' => $activity->user->id,
                'name' => $activity->user->name,
                'email' => $activity->user->email,
            ] : null,
            'created_at' => $activity->created_at?->toDateTimeString(),
            'updated_at' => $activity->updated_at?->toDateTimeString(),
        ];
    }

    public function create(Customer $customer, array $data, User $actor): Activity
    {
        return $customer->activities()->create([
            ...$data,
            'user_id' => $actor->id,
        ])->load('user');
    }

    public function update(Activity $activity, array $data): Activity
    {
        $activity->update($data);

        return $activity->refresh()->load('user');
    }

    public function delete(Activity $activity): void
    {
        $activity->delete();
    }
}

