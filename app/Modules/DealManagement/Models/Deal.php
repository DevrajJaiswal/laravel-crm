<?php

namespace App\Modules\DealManagement\Models;

use App\Modules\Users\Models\User;
use App\Modules\CustomerManagement\Models\Customer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deal extends Model
{
    use HasFactory;

    public const STAGES = [
        'Prospecting',
        'Qualification',
        'Proposal',
        'Negotiation',
        'Won',
        'Lost',
    ];

    protected $fillable = [
        'customer_id',
        'owner_id',
        'title',
        'amount',
        'stage',
        'probability',
        'expected_close_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'expected_close_date' => 'date',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}

