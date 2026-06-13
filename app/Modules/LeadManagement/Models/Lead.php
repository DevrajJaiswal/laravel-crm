<?php

namespace App\Modules\LeadManagement\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'company_name',
        'contact_name',
        'email',
        'phone',
        'source',
        'status',
        'value',
        'notes',
        'owner_id',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
