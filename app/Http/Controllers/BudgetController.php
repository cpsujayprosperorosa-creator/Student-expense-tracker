<?php

namespace App\Http\Controllers;

use App\Http\Requests\BudgetRequest;
use App\Models\Budget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $budgets = $user->budgets()
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();

        // Spending per budgeted month, folded from per-day sums (database-agnostic).
        $spentByMonth = $user->transactions()
            ->selectRaw('transaction_date, SUM(amount) as total')
            ->groupBy('transaction_date')
            ->pluck('total', 'transaction_date')
            ->reduce(function (array $carry, $total, $date) {
                $key = substr((string) $date, 0, 7);
                $carry[$key] = bcadd($carry[$key] ?? '0', (string) $total, 2);

                return $carry;
            }, []);

        $rows = $budgets->map(fn (Budget $b) => [
            'id' => $b->id,
            'year' => $b->year,
            'month' => $b->month,
            'amount' => $b->amount,
            'spent' => $spentByMonth[sprintf('%04d-%02d', $b->year, $b->month)] ?? '0.00',
        ]);

        return Inertia::render('Budgets/Index', [
            'budgets' => $rows,
            'current' => ['year' => (int) now()->format('Y'), 'month' => (int) now()->format('n')],
        ]);
    }

    public function store(BudgetRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $request->user()->budgets()->updateOrCreate(
            ['year' => $data['year'], 'month' => $data['month']],
            ['amount' => $data['amount']],
        );

        return back()->with('success', 'Budget saved.');
    }

    public function destroy(Budget $budget): RedirectResponse
    {
        Gate::authorize('delete', $budget);

        $budget->delete();

        return back()->with('success', 'Budget removed.');
    }
}
