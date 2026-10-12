<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'in:'.implode(',', Transaction::CATEGORIES)],
            'payment_method' => ['nullable', 'in:'.implode(',', Transaction::PAYMENT_METHODS)],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $transactions = $request->user()->transactions()
            ->filter($filters)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => (object) $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Transactions/Form', ['transaction' => null]);
    }

    public function store(TransactionRequest $request): RedirectResponse
    {
        $request->user()->transactions()->create($request->validated());

        return redirect()->route('transactions.index')->with('success', 'Expense added.');
    }

    public function edit(Transaction $transaction): Response
    {
        Gate::authorize('update', $transaction);

        return Inertia::render('Transactions/Form', ['transaction' => $transaction]);
    }

    public function update(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        Gate::authorize('update', $transaction);

        $transaction->update($request->validated());

        return redirect()->route('transactions.index')->with('success', 'Expense updated.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        Gate::authorize('delete', $transaction);

        $transaction->delete();

        return back()->with('success', 'Expense deleted.');
    }
}
