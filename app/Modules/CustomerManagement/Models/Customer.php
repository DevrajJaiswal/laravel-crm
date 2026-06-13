<?php

namespace App\Modules\CustomerManagement\Models;

use App\Models\User;
use App\Modules\DealManagement\Models\Deal;
use App\Modules\ActivityManagement\Models\Activity;
use App\Modules\ContactManagement\Models\Contact;
use App\Modules\SupportTicketManagement\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_name',
        'email',
        'phone',
        'status',
        'industry',
        'billing_address',
        'shipping_address',
        'notes',
        'owner_id',
        'converted_from_lead_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function deals(): HasMany
    {
        return $this->hasMany(Deal::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
