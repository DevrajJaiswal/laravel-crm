<?php

namespace App\Modules\SupportTicketManagement\Models;

use App\Modules\Users\Models\User;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    use HasFactory;

    public const STATUSES = [
        'Open',
        'In Progress',
        'Waiting on Customer',
        'Resolved',
        'Closed',
    ];

    public const PRIORITIES = [
        'Low',
        'Medium',
        'High',
        'Urgent',
    ];

    protected $fillable = [
        'customer_id',
        'contact_id',
        'assigned_to_user_id',
        'subject',
        'description',
        'status',
        'priority',
        'resolution_notes',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }
}

