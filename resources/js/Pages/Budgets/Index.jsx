import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Button, Card, EmptyState, Field, ProgressBar, fieldClass } from '@/Components/Ui';
import { MONTHS, money } from '@/lib/format';

export default function Index({ budgets, current }) {
    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        year: current.year,
        month: current.month,
        amount: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('budgets.store'), {
            preserveScroll: true,
            onSuccess: () => reset('amount'),
        });
    };

    const edit = (b) => setData({ year: b.year, month: b.month, amount: b.amount });

    const confirmDelete = () => {
        setDeleteBusy(true);
        router.delete(route('budgets.destroy', deleting.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleteBusy(false);
                setDeleting(null);
            },
        });
    };

    const years = Array.from({ length: 7 }, (_, i) => current.year - 2 + i);

    return (
        <AuthenticatedLayout header={<h1 className="text-lg font-semibold text-slate-900">Budgets</h1>}>
            <Head title="Budgets" />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card title="Set monthly budget" className="h-fit">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Month" htmlFor="month" error={errors.month}>
                                <select
                                    id="month"
                                    className={fieldClass}
                                    value={data.month}
                                    onChange={(e) => setData('month', Number(e.target.value))}
                                >
                                    {MONTHS.map((m, i) => (
                                        <option key={m} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Year" htmlFor="year" error={errors.year}>
                                <select
                                    id="year"
                                    className={fieldClass}
                                    value={data.year}
                                    onChange={(e) => setData('year', Number(e.target.value))}
                                >
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                        <Field label="Budget amount" htmlFor="amount" error={errors.amount}>
                            <input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="decimal"
                                className={fieldClass}
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="0.00"
                            />
                        </Field>
                        <p className="text-xs text-slate-500">
                            Saving for a month that already has a budget updates it.
                        </p>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Saving…' : 'Save budget'}
                        </Button>
                    </form>
                </Card>

                <Card title="Your budgets" padded={false} className="lg:col-span-2">
                    {budgets.length === 0 ? (
                        <EmptyState
                            title="No budgets yet"
                            description="Set a monthly budget to see how much you have left to spend."
                        />
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {budgets.map((b) => {
                                const remaining = Number(b.amount) - Number(b.spent);
                                return (
                                    <li key={b.id} className="px-5 py-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium text-slate-900">
                                                {MONTHS[b.month - 1]} {b.year}
                                            </p>
                                            <div className="flex gap-3 text-sm">
                                                <button onClick={() => edit(b)} className="text-slate-600 hover:text-slate-900">
                                                    Edit
                                                </button>
                                                <button onClick={() => setDeleting(b)} className="text-red-600 hover:text-red-700">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <ProgressBar value={Number(b.spent)} max={Number(b.amount)} />
                                        </div>
                                        <div className="mt-2 flex flex-wrap justify-between gap-x-4 text-xs text-slate-500">
                                            <span>Spent {money(b.spent)} of {money(b.amount)}</span>
                                            <span className={remaining < 0 ? 'font-medium text-red-600' : ''}>
                                                {remaining < 0
                                                    ? `${money(Math.abs(remaining))} over`
                                                    : `${money(remaining)} left`}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Card>
            </div>

            <ConfirmDialog
                show={Boolean(deleting)}
                title="Delete this budget?"
                message={deleting ? `The ${MONTHS[deleting.month - 1]} ${deleting.year} budget will be removed. Your expenses are not affected.` : ''}
                processing={deleteBusy}
                onConfirm={confirmDelete}
                onCancel={() => setDeleting(null)}
            />
        </AuthenticatedLayout>
    );
}
