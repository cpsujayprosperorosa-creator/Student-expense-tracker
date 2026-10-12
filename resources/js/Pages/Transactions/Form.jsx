import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button, ButtonLink, Card, Field, fieldClass } from '@/Components/Ui';
import { categoryLabel, titleCase } from '@/lib/format';

export default function Form({ transaction }) {
    const { options } = usePage().props;
    const editing = Boolean(transaction);

    const { data, setData, post, put, processing, errors } = useForm({
        title: transaction?.title ?? '',
        amount: transaction?.amount ?? '',
        category: transaction?.category ?? options.categories[0],
        transaction_date: transaction?.transaction_date ?? new Date().toLocaleDateString('en-CA'),
        payment_method: transaction?.payment_method ?? options.paymentMethods[0],
        notes: transaction?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) put(route('transactions.update', transaction.id));
        else post(route('transactions.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-900">
                    {editing ? 'Edit expense' : 'Add expense'}
                </h1>
            }
        >
            <Head title={editing ? 'Edit expense' : 'Add expense'} />

            <Card className="max-w-2xl">
                <form onSubmit={submit} className="space-y-5">
                    <Field label="Title" htmlFor="title" error={errors.title}>
                        <input
                            id="title"
                            className={fieldClass}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Lunch at canteen"
                            autoFocus
                        />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Amount" htmlFor="amount" error={errors.amount}>
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
                        <Field label="Date" htmlFor="transaction_date" error={errors.transaction_date}>
                            <input
                                id="transaction_date"
                                type="date"
                                className={fieldClass}
                                value={data.transaction_date}
                                onChange={(e) => setData('transaction_date', e.target.value)}
                            />
                        </Field>
                        <Field label="Category" htmlFor="category" error={errors.category}>
                            <select
                                id="category"
                                className={fieldClass}
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            >
                                {options.categories.map((c) => (
                                    <option key={c} value={c}>{categoryLabel(c)}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Payment method" htmlFor="payment_method" error={errors.payment_method}>
                            <select
                                id="payment_method"
                                className={fieldClass}
                                value={data.payment_method}
                                onChange={(e) => setData('payment_method', e.target.value)}
                            >
                                {options.paymentMethods.map((p) => (
                                    <option key={p} value={p}>{titleCase(p)}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Notes (optional)" htmlFor="notes" error={errors.notes}>
                        <textarea
                            id="notes"
                            rows={3}
                            className={fieldClass}
                            value={data.notes ?? ''}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </Field>

                    <div className="flex justify-end gap-2">
                        <ButtonLink href={route('transactions.index')} variant="secondary">
                            Cancel
                        </ButtonLink>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : editing ? 'Save changes' : 'Add expense'}
                        </Button>
                    </div>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
