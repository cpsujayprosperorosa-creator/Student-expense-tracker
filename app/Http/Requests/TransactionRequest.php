<?php

namespace App\Http\Requests;

use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ownership is enforced in the controller via TransactionPolicy.
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'gt:0', 'max:9999999999.99', 'decimal:0,2'],
            'category' => ['required', Rule::in(Transaction::CATEGORIES)],
            'transaction_date' => ['required', 'date'],
            'payment_method' => ['required', Rule::in(Transaction::PAYMENT_METHODS)],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
