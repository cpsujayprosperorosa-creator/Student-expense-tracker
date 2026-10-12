<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $now = now();
        $start = $now->copy()->startOfMonth()->toDateString();
        $end = $now->copy()->endOfMonth()->toDateString();

        $monthTotal = (string) $user->transactions()
            ->whereBetween('transaction_date', [$start, $end])
            ->sum('amount');

        $allTimeTotal = (string) $user->transactions()->sum('amount');

        $budget = $user->budgets()
            ->where('year', $now->year)
            ->where('month', $now->month)
            ->value('amount');

        $byCategory = $user->transactions()
            ->whereBetween('transaction_date', [$start, $end])
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => ['category' => $r->category, 'total' => number_format((float) $r->total, 2, '.', '')]);

        $recent = $user->transactions()
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => number_format((float) $allTimeTotal, 2, '.', ''),
                'month_total' => number_format((float) $monthTotal, 2, '.', ''),
                'budget' => $budget,
                'remaining' => $budget !== null ? bcsub((string) $budget, number_format((float) $monthTotal, 2, '.', ''), 2) : null,
                'month_label' => $now->format('F Y'),
            ],
            'byCategory' => $byCategory,
            'recent' => $recent,
        ]);
    }
}
