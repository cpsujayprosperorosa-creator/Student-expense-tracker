import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PlusIcon } from '@/Components/Icons';
import { CategoryChart } from '@/Components/Charts';
import {
    ButtonLink,
    CategoryBadge,
    Card,
    EmptyState,
    ProgressBar,
    StatCard,
} from '@/Components/Ui';
import { formatDate, money } from '@/lib/format';

const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function Dashboard({ stats, byCategory, recent }) {
    const user = usePage().props.auth.user;
    const hasBudget = stats.budget !== null;
    const remaining = hasBudget ? Number(stats.remaining) : null;
    const firstName = user.name.split(' ')[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                            {stats.month_label}
                        </p>
                        <h1 className="truncate">
                            {greeting()}, {firstName}.
                        </h1>
                    </div>
                    <ButtonLink href={route('transactions.create')} className="shrink-0">
                        <PlusIcon width={16} height={16} />
                        <span className="hidden sm:inline">Add Expense</span>
                    </ButtonLink>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    featured
                    label="Spent this month"
                    value={money(stats.month_total)}
                    hint={hasBudget ? `of ${money(stats.budget)} budget` : 'No budget set yet'}
                />
                <StatCard
                    label="Remaining"
                    value={hasBudget ? money(stats.remaining) : '—'}
                    tone={hasBudget ? (remaining < 0 ? 'danger' : 'good') : 'default'}
                    hint={
                        hasBudget ? (
                            <div className="mt-2">
                                <ProgressBar value={Number(stats.month_total)} max={Number(stats.budget)} />
                                {remaining < 0 && <p className="mt-1 text-red-700">Over budget</p>}
                            </div>
                        ) : (
                            <Link href={route('budgets.index')} className="text-forest underline underline-offset-2">
                                Set a monthly budget
                            </Link>
                        )
                    }
                />
                <StatCard
                    label="Monthly budget"
                    value={hasBudget ? money(stats.budget) : '—'}
                    hint={hasBudget ? stats.month_label : 'Nothing planned'}
                />
                <StatCard label="All-time spending" value={money(stats.total)} hint="Since you started" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <Card title="Where it went" className="lg:col-span-2">
                    {byCategory.length ? (
                        <CategoryChart data={byCategory} />
                    ) : (
                        <EmptyState
                            title="Nothing spent yet"
                            description="Add an expense and your category breakdown shows up here."
                        />
                    )}
                </Card>

                <Card
                    title="Latest entries"
                    padded={false}
                    className="lg:col-span-3"
                    action={
                        <Link href={route('transactions.index')} className="text-sm text-forest underline underline-offset-2">
                            View all
                        </Link>
                    }
                >
                    {recent.length ? (
                        <ul className="divide-y divide-dashed divide-slate-200">
                            {recent.map((t) => (
                                <li key={t.id} className="px-5 py-3.5">
                                    <div className="flex items-baseline gap-2">
                                        <span className="truncate text-sm font-medium text-slate-900">{t.title}</span>
                                        <span className="min-w-4 flex-1 border-b border-dotted border-slate-300" />
                                        <span className="font-mono text-sm tabular-nums text-slate-900">
                                            {money(t.amount)}
                                        </span>
                                    </div>
                                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                        {formatDate(t.transaction_date)}
                                        <CategoryBadge category={t.category} />
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            title="Your ledger is empty"
                            description="Record your first expense to get started."
                            action={<ButtonLink href={route('transactions.create')}>Add Expense</ButtonLink>}
                        />
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
