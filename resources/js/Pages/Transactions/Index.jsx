import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Modal from '@/Components/Modal';
import { PlusIcon } from '@/Components/Icons';
import {
    Button,
    ButtonLink,
    CategoryBadge,
    Card,
    EmptyState,
    Pagination,
    fieldClass,
} from '@/Components/Ui';
import { categoryLabel, formatDate, money, titleCase } from '@/lib/format';

export default function Index({ transactions, filters }) {
    const { options } = usePage().props;
    const [form, setForm] = useState({
        search: filters.search ?? '',
        category: filters.category ?? '',
        payment_method: filters.payment_method ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });
    const [loading, setLoading] = useState(false);
    const [viewing, setViewing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    useEffect(() => {
        const offStart = router.on('start', () => setLoading(true));
        const offFinish = router.on('finish', () => setLoading(false));
        return () => {
            offStart();
            offFinish();
        };
    }, []);

    const hasFilters = Object.values(form).some(Boolean);

    const apply = (e) => {
        e?.preventDefault();
        const params = Object.fromEntries(Object.entries(form).filter(([, v]) => v));
        router.get(route('transactions.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const reset = () => {
        setForm({ search: '', category: '', payment_method: '', from: '', to: '' });
        router.get(route('transactions.index'), {}, { preserveState: true, replace: true });
    };

    const confirmDelete = () => {
        setDeleteBusy(true);
        router.delete(route('transactions.destroy', deleting.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleteBusy(false);
                setDeleting(null);
            },
        });
    };

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const rows = transactions.data;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-lg font-semibold text-slate-900">Transactions</h1>
                    <ButtonLink href={route('transactions.create')}>
                        <PlusIcon width={16} height={16} />
                        Add Expense
                    </ButtonLink>
                </div>
            }
        >
            <Head title="Transactions" />

            <Card className="mb-6">
                <form onSubmit={apply} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                    <input
                        type="search"
                        aria-label="Search by title"
                        placeholder="Search title…"
                        className={`${fieldClass} lg:col-span-2`}
                        value={form.search}
                        onChange={set('search')}
                    />
                    <select aria-label="Category" className={fieldClass} value={form.category} onChange={set('category')}>
                        <option value="">All categories</option>
                        {options.categories.map((c) => (
                            <option key={c} value={c}>{categoryLabel(c)}</option>
                        ))}
                    </select>
                    <select aria-label="Payment method" className={fieldClass} value={form.payment_method} onChange={set('payment_method')}>
                        <option value="">All payment methods</option>
                        {options.paymentMethods.map((p) => (
                            <option key={p} value={p}>{titleCase(p)}</option>
                        ))}
                    </select>
                    <input type="date" aria-label="From date" className={fieldClass} value={form.from} onChange={set('from')} />
                    <input type="date" aria-label="To date" className={fieldClass} value={form.to} onChange={set('to')} />
                    <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
                        <Button type="submit">Apply filters</Button>
                        {hasFilters && (
                            <Button variant="secondary" onClick={reset}>
                                Reset
                            </Button>
                        )}
                    </div>
                </form>
            </Card>

            <Card padded={false}>
                <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                    {rows.length === 0 ? (
                        <EmptyState
                            title={hasFilters ? 'No matching transactions' : 'No transactions yet'}
                            description={
                                hasFilters
                                    ? 'Try adjusting or resetting your filters.'
                                    : 'Add your first expense to start tracking.'
                            }
                            action={
                                !hasFilters && (
                                    <ButtonLink href={route('transactions.create')}>Add Expense</ButtonLink>
                                )
                            }
                        />
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Date</th>
                                            <th className="px-5 py-3 font-medium">Title</th>
                                            <th className="px-5 py-3 font-medium">Category</th>
                                            <th className="px-5 py-3 font-medium">Payment</th>
                                            <th className="px-5 py-3 text-right font-medium">Amount</th>
                                            <th className="px-5 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rows.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50">
                                                <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                                                    {formatDate(t.transaction_date)}
                                                </td>
                                                <td className="px-5 py-3 font-medium text-slate-900">
                                                    <button onClick={() => setViewing(t)} className="text-left hover:underline">
                                                        {t.title}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3"><CategoryBadge category={t.category} /></td>
                                                <td className="px-5 py-3 text-slate-600">{titleCase(t.payment_method)}</td>
                                                <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-900">
                                                    {money(t.amount)}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-3 text-right">
                                                    <Link href={route('transactions.edit', t.id)} className="mr-3 text-slate-600 hover:text-slate-900">
                                                        Edit
                                                    </Link>
                                                    <button onClick={() => setDeleting(t)} className="text-red-600 hover:text-red-700">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <ul className="divide-y divide-slate-100 md:hidden">
                                {rows.map((t) => (
                                    <li key={t.id} className="px-4 py-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <button onClick={() => setViewing(t)} className="min-w-0 text-left">
                                                <p className="truncate text-sm font-medium text-slate-900">{t.title}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {formatDate(t.transaction_date)} · {titleCase(t.payment_method)}
                                                </p>
                                            </button>
                                            <span className="text-sm font-medium tabular-nums text-slate-900">
                                                {money(t.amount)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <CategoryBadge category={t.category} />
                                            <div className="text-sm">
                                                <Link href={route('transactions.edit', t.id)} className="mr-4 text-slate-600">
                                                    Edit
                                                </Link>
                                                <button onClick={() => setDeleting(t)} className="text-red-600">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {rows.length > 0 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row">
                        <p className="text-xs text-slate-500">
                            Showing {transactions.from}–{transactions.to} of {transactions.total}
                        </p>
                        <Pagination links={transactions.links} />
                    </div>
                )}
            </Card>

            <Modal show={Boolean(viewing)} maxWidth="md" onClose={() => setViewing(null)}>
                {viewing && (
                    <div className="p-6">
                        <h2 className="text-base font-semibold text-slate-900">{viewing.title}</h2>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                            {money(viewing.amount)}
                        </p>
                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd>{formatDate(viewing.transaction_date)}</dd></div>
                            <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd><CategoryBadge category={viewing.category} /></dd></div>
                            <div className="flex justify-between"><dt className="text-slate-500">Payment</dt><dd>{titleCase(viewing.payment_method)}</dd></div>
                            <div>
                                <dt className="text-slate-500">Notes</dt>
                                <dd className="mt-1 whitespace-pre-wrap text-slate-800">
                                    {viewing.notes || <span className="text-slate-400">No notes</span>}
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>
                            <ButtonLink href={route('transactions.edit', viewing.id)}>Edit</ButtonLink>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                show={Boolean(deleting)}
                title="Delete this expense?"
                message={deleting ? `"${deleting.title}" (${money(deleting.amount)}) will be permanently removed.` : ''}
                processing={deleteBusy}
                onConfirm={confirmDelete}
                onCancel={() => setDeleting(null)}
            />
        </AuthenticatedLayout>
    );
}
