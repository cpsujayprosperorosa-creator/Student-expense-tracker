import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { BarChart, CategoryChart } from '@/Components/Charts';
import { Card, EmptyState, fieldClass } from '@/Components/Ui';
import { MONTHS, categoryLabel, money } from '@/lib/format';

export default function Index({ year, month, years, monthly, byCategory }) {
    const change = (patch) =>
        router.get(route('reports.index'), { year, month, ...patch }, { preserveState: true, replace: true });

    const yearTotal = monthly.reduce((s, m) => s + Number(m.total), 0);
    const scope = month ? `${MONTHS[month - 1]} ${year}` : `${year}`;

    return (
        <AuthenticatedLayout header={<h1 className="text-lg font-semibold text-slate-900">Reports</h1>}>
            <Head title="Reports" />

            <div className="mb-6 flex flex-wrap items-center gap-3">
                <select
                    aria-label="Year"
                    className={`${fieldClass} !w-auto`}
                    value={year}
                    onChange={(e) => change({ year: Number(e.target.value) })}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <select
                    aria-label="Month"
                    className={`${fieldClass} !w-auto`}
                    value={month}
                    onChange={(e) => change({ month: Number(e.target.value) })}
                >
                    <option value={0}>Whole year</option>
                    {MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card title={`Monthly spending · ${year}`}>
                    {yearTotal > 0 ? (
                        <>
                            <BarChart
                                data={monthly.map((m) => ({
                                    label: MONTHS[m.month - 1].slice(0, 3),
                                    value: m.total,
                                    marker: m.budget,
                                }))}
                            />
                            <p className="mt-3 text-xs text-slate-500">
                                Dashed line marks the monthly budget where one is set.
                            </p>
                        </>
                    ) : (
                        <EmptyState title="No spending recorded" description={`There are no expenses in ${year}.`} />
                    )}
                </Card>

                <Card title={`By category · ${scope}`}>
                    {byCategory.length ? (
                        <CategoryChart data={byCategory} />
                    ) : (
                        <EmptyState title="No spending recorded" description={`There are no expenses in ${scope}.`} />
                    )}
                </Card>

                <Card title="Monthly summary" padded={false}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Month</th>
                                    <th className="px-5 py-3 text-right font-medium">Spent</th>
                                    <th className="px-5 py-3 text-right font-medium">Budget</th>
                                    <th className="px-5 py-3 text-right font-medium">Difference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {monthly.map((m) => {
                                    const diff = m.budget !== null ? Number(m.budget) - Number(m.total) : null;
                                    return (
                                        <tr key={m.month}>
                                            <td className="px-5 py-2.5 text-slate-700">{MONTHS[m.month - 1]}</td>
                                            <td className="px-5 py-2.5 text-right tabular-nums">{money(m.total)}</td>
                                            <td className="px-5 py-2.5 text-right tabular-nums text-slate-600">
                                                {m.budget !== null ? money(m.budget) : '—'}
                                            </td>
                                            <td className={`px-5 py-2.5 text-right tabular-nums ${diff !== null && diff < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                                {diff !== null ? money(diff) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="border-t border-slate-200 font-medium">
                                <tr>
                                    <td className="px-5 py-3">Total</td>
                                    <td className="px-5 py-3 text-right tabular-nums">{money(yearTotal)}</td>
                                    <td colSpan={2} />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>

                <Card title={`Category totals · ${scope}`} padded={false}>
                    {byCategory.length ? (
                        <table className="min-w-full text-left text-sm">
                            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Category</th>
                                    <th className="px-5 py-3 text-right font-medium">Transactions</th>
                                    <th className="px-5 py-3 text-right font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {byCategory.map((c) => (
                                    <tr key={c.category}>
                                        <td className="px-5 py-2.5 text-slate-700">{categoryLabel(c.category)}</td>
                                        <td className="px-5 py-2.5 text-right tabular-nums text-slate-600">{c.count}</td>
                                        <td className="px-5 py-2.5 text-right tabular-nums">{money(c.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState title="Nothing to show" />
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
