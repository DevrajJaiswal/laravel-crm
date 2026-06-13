<?php

namespace App\Modules\ContactManagement\Services;

use App\Modules\ContactManagement\Models\Contact;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Support\Collection;

class ContactService
{
    public function listForCustomer(Customer $customer): Collection
    {
        return $customer->contacts()
            ->latest()
            ->get()
            ->map(fn (Contact $contact) => $this->payload($contact));
    }

    public function payload(Contact $contact): array
    {
        return [
            'id' => $contact->id,
            'customer_id' => $contact->customer_id,
            'first_name' => $contact->first_name,
            'last_name' => $contact->last_name,
            'name' => trim($contact->first_name.' '.$contact->last_name),
            'email' => $contact->email,
            'phone' => $contact->phone,
            'job_title' => $contact->job_title,
            'is_primary' => $contact->is_primary,
            'notes' => $contact->notes,
            'created_at' => $contact->created_at?->toDateTimeString(),
            'updated_at' => $contact->updated_at?->toDateTimeString(),
        ];
    }

    public function create(Customer $customer, array $data): Contact
    {
        $contact = $customer->contacts()->create($data);

        if ($contact->is_primary) {
            $customer->contacts()
                ->whereKeyNot($contact->id)
                ->update(['is_primary' => false]);
        }

        return $contact;
    }

    public function update(Contact $contact, array $data): Contact
    {
        $contact->update($data);

        if ($contact->is_primary) {
            $contact->customer->contacts()
                ->whereKeyNot($contact->id)
                ->update(['is_primary' => false]);
        }

        return $contact->refresh();
    }

    public function delete(Contact $contact): void
    {
        $contact->delete();
    }
}
