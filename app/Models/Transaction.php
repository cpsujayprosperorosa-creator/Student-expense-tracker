<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    public const CATEGORIES = ['food', 'transportation', 'school', 'bills', 'personal', 'entertainment', 'other'];

    public const PAYMENT_METHODS = ['cash', 'card', 'e-wallet', 'bank transfer', 'other'];

    // user_id is intentionally not fillable: it is always set from the authenticated user.
    protected $fillable = [
        'title',
        'amount',
        'category',
        'transaction_date',
        'payment_method',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transaction_date' => 'date:Y-m-d',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function ($q, $search) {
                $escaped = addcslashes($search, '\\%_');
                $q->where('title', 'like', "%{$escaped}%");
            })
            ->when($filters['category'] ?? null, fn ($q, $v) => $q->where('category', $v))
            ->when($filters['payment_method'] ?? null, fn ($q, $v) => $q->where('payment_method', $v))
            ->when($filters['from'] ?? null, fn ($q, $v) => $q->whereDate('transaction_date', '>=', $v))
            ->when($filters['to'] ?? null, fn ($q, $v) => $q->whereDate('transaction_date', '<=', $v));
    }
}
