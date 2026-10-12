<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    use HasFactory;

    // user_id is intentionally not fillable: it is always set from the authenticated user.
    protected $fillable = ['year', 'month', 'amount'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'year' => 'integer',
            'month' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
