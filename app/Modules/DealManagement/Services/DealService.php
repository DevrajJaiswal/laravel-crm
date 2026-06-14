<?php

namespace App\Modules\DealManagement\Services;

use App\Models\User;
use App\Modules\DealManagement\Models\Deal;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\NotificationManagement\Services\NotificationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DealService
{
    public function __construct(
        private NotificationService $notifications
    ) {}

    public function pipeline(): array
    {
        $deals = Deal::query()
            ->with(['customer', 'owner'])
            ->latest()
            ->get();

        return collect(Deal::STAGES)->mapWithKeys(function (string $stage) use ($deals) {
            return [
                $stage => $deals
                    ->where('stage', $stage)
                    ->values()
                    ->map(fn (Deal $deal) => $this->payload($deal)),
            ];
        })->all();
    }

    public function list(int $perPage = 10): LengthAwarePaginator
    {
        return Deal::query()
            ->with(['customer', 'owner'])
            ->latest()
            ->paginate($perPage);
    }

    public function customers(): Collection
    {
        return Customer::query()
            ->orderBy('company_name')
            ->get(['id', 'name', 'company_name'])
            ->map(fn (Customer $customer) => [
                'id' => $customer->id,
                'label' => $customer->company_name.' - '.$customer->name,
            ]);
    }

    public function payload(Deal $deal): array
    {
        return [
            'id' => $deal->id,
            'customer_id' => $deal->customer_id,
            'title' => $deal->title,
            'amount' => $deal->amount,
            'stage' => $deal->stage,
            'probability' => $deal->probability,
            'expected_close_date' => $deal->expected_close_date?->toDateString(),
            'notes' => $deal->notes,
            'customer' => $deal->customer ? [
                'id' => $deal->customer->id,
                'name' => $deal->customer->name,
                'company_name' => $deal->customer->company_name,
            ] : null,
            'owner' => $deal->owner ? [
                'id' => $deal->owner->id,
                'name' => $deal->owner->name,
                'email' => $deal->owner->email,
            ] : null,
            'created_at' => $deal->created_at?->toDateTimeString(),
            'updated_at' => $deal->updated_at?->toDateTimeString(),
        ];
    }

    public function create(array $data, User $owner): Deal
    {
        return Deal::create([
            ...$data,
            'owner_id' => $owner->id,
        ])->load(['customer', 'owner']);
    }

    public function update(Deal $deal, array $data): Deal
    {
        $wasWon = $deal->stage === 'Won';
        $deal->update($data);

        $deal->refresh()->load(['customer', 'owner']);

        if (! $wasWon && $deal->stage === 'Won' && $deal->owner) {
            $this->notifications->create($deal->owner, [
                'type' => 'deal.won',
                'title' => 'Deal won',
                'message' => sprintf('Deal "%s" moved to Won.', $deal->title),
                'link' => "/deals/{$deal->id}",
                'data' => [
                    'deal_id' => $deal->id,
                ],
            ]);
        }

        return $deal;
    }

    public function delete(Deal $deal): void
    {
        $deal->delete();
    }
}
