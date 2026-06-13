<?php

namespace App\Modules\SupportTicketManagement\Requests;

use App\Modules\SupportTicketManagement\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'contact_id' => ['nullable', 'exists:contacts,id'],
            'assigned_to_user_id' => ['nullable', 'exists:users,id'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'status' => ['required', Rule::in(Ticket::STATUSES)],
            'priority' => ['required', Rule::in(Ticket::PRIORITIES)],
            'resolution_notes' => ['nullable', 'string'],
        ];
    }
}
