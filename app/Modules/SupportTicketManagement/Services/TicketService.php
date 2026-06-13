<?php

namespace App\Modules\SupportTicketManagement\Services;

use App\Models\User;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\CustomerManagement\Models\Customer;
use App\Modules\SupportTicketManagement\Models\Ticket;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TicketService
{
    public function list(int $perPage = 10): LengthAwarePaginator
    {
        return Ticket::query()
            ->with(['customer', 'contact', 'assignedTo'])
            ->latest()
            ->paginate($perPage);
    }

    public function payload(Ticket $ticket): array
    {
        return [
            'id' => $ticket->id,
            'customer_id' => $ticket->customer_id,
            'contact_id' => $ticket->contact_id,
            'assigned_to_user_id' => $ticket->assigned_to_user_id,
            'subject' => $ticket->subject,
            'description' => $ticket->description,
            'status' => $ticket->status,
            'priority' => $ticket->priority,
            'resolution_notes' => $ticket->resolution_notes,
            'closed_at' => $ticket->closed_at?->toDateTimeString(),
            'customer' => $ticket->customer ? [
                'id' => $ticket->customer->id,
                'name' => $ticket->customer->name,
                'company_name' => $ticket->customer->company_name,
            ] : null,
            'contact' => $ticket->contact ? [
                'id' => $ticket->contact->id,
                'name' => trim($ticket->contact->first_name.' '.$ticket->contact->last_name),
                'email' => $ticket->contact->email,
            ] : null,
            'assigned_to' => $ticket->assignedTo ? [
                'id' => $ticket->assignedTo->id,
                'name' => $ticket->assignedTo->name,
                'email' => $ticket->assignedTo->email,
            ] : null,
            'created_at' => $ticket->created_at?->toDateTimeString(),
            'updated_at' => $ticket->updated_at?->toDateTimeString(),
        ];
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

    public function contacts(Customer $customer): Collection
    {
        return $customer->contacts()
            ->orderBy('first_name')
            ->get()
            ->map(fn (Contact $contact) => [
                'id' => $contact->id,
                'label' => trim($contact->first_name.' '.$contact->last_name),
            ]);
    }

    public function assignees(): Collection
    {
        return User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'label' => $user->name.' ('.$user->email.')',
            ]);
    }

    public function create(array $data): Ticket
    {
        if (in_array($data['status'] ?? 'Open', ['Resolved', 'Closed'], true)) {
            $data['closed_at'] = now();
        }

        return Ticket::create($data)->load(['customer', 'contact', 'assignedTo']);
    }

    public function update(Ticket $ticket, array $data): Ticket
    {
        if (in_array($data['status'] ?? $ticket->status, ['Resolved', 'Closed'], true)) {
            $data['closed_at'] = $ticket->closed_at ?? now();
        } else {
            $data['closed_at'] = null;
        }

        $ticket->update($data);

        return $ticket->refresh()->load(['customer', 'contact', 'assignedTo']);
    }

    public function delete(Ticket $ticket): void
    {
        $ticket->delete();
    }
}
