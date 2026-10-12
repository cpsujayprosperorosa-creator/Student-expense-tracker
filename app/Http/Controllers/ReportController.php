<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $request->validate([
            'year' => ['nullable', 'integer', 'between:2000,2100'],
            'month' => ['nullable', 'integer', 'between:0,12'], // 0 / empty = whole year
        ]);

        $year = (int) ($data['year'] ?? now()->year);
        $month = (int) ($data['month'] ?? 0);
        $user = $request->user();

        $yearStart = sprintf('%04d-01-01', $year);
        $yearEnd = sprintf('%04d-12-31', $year);

        // Per-day sums for the year; folded into months in PHP (database-agnostic, <= 366 rows).
        $daily = $user->transactions()
            ->whereBetween('transaction_date', [$yearStart, $yearEnd])
            ->selectRaw('transaction_date, SUM(amount) as total')
            ->groupBy('transaction_date')
            ->pluck('total', 'transaction_date');

        $monthTotals = array_fill(1, 12, '0.00');
        foreach ($daily as $date => $total) {
            $m = (int) substr((string) $date, 5, 2);
            $monthTotals[$m] = bcadd($monthTotals[$m], (string) $total, 2);
        }

        $budgets = $user->budgets()->where('year', $year)->pluck('amount', 'month');

        $monthly = [];
        foreach ($monthTotals as $m => $total) {
            $monthly[] = [
                'month' => $m,
                'total' => $total,
                'budget' => $budgets[$m] ?? null,
            ];
        }

        $categoryQuery = $user->transactions()->selectRaw('category, SUM(amount) as total, COUNT(*) as count');
        if ($month >= 1) {
            $from = sprintf('%04d-%02d-01', $year, $month);
            $to = date('Y-m-t', strtotime($from));
            $categoryQuery->whereBetween('transaction_date', [$from, $to]);
        } else {
            $categoryQuery->whereBetween('transaction_date', [$yearStart, $yearEnd]);
        }

        $byCategory = $categoryQuery->groupBy('category')->orderByDesc('total')->get()
            ->map(fn ($r) => [
                'category' => $r->category,
                'total' => number_format((float) $r->total, 2, '.', ''),
                'count' => (int) $r->count,
            ]);

        $years = $user->transactions()
            ->selectRaw('transaction_date')
            ->distinct()
            ->pluck('transaction_date')
            ->map(fn ($d) => (int) substr((string) $d, 0, 4))
            ->push((int) now()->year, $year)
            ->unique()->sortDesc()->values();

        return Inertia::render('Reports/Index', [
            'year' => $year,
            'month' => $month,
            'years' => $years,
            'monthly' => $monthly,
            'byCategory' => $byCategory,
        ]);
    }
}
