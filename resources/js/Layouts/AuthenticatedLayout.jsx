import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ChartIcon,
    CloseIcon,
    CogIcon,
    HomeIcon,
    MenuIcon,
    ReceiptIcon,
    WalletIcon,
} from '@/Components/Icons';
import Dropdown from '@/Components/Dropdown';
import Toast from '@/Components/Toast';

const NAV = [
    { label: 'Dashboard', route: 'dashboard', match: 'dashboard', icon: HomeIcon },
    { label: 'Transactions', route: 'transactions.index', match: 'transactions.*', icon: ReceiptIcon },
    { label: 'Budgets', route: 'budgets.index', match: 'budgets.*', icon: WalletIcon },
    { label: 'Reports', route: 'reports.index', match: 'reports.*', icon: ChartIcon },
    { label: 'Settings', route: 'profile.edit', match: 'profile.*', icon: CogIcon },
];

function Sidebar({ onNavigate }) {
    return (
        <div className="relative flex h-full flex-col bg-forest text-[#f4efe4]">
            {/* ledger rules */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(to bottom, transparent 0 31px, #fff 31px 32px)',
                }}
            />

            <div className="relative flex h-20 items-center px-6">
                <Link href={route('dashboard')} className="font-serif text-xl tracking-tight">
                    Pocket<span className="italic text-gold">Ledger</span>
                </Link>
            </div>

            <nav className="relative flex-1 space-y-0.5 px-3 py-2">
                {NAV.map(({ label, route: name, match, icon: Icon }) => {
                    const active = route().current(match);
                    return (
                        <Link
                            key={name}
                            href={route(name)}
                            onClick={onNavigate}
                            aria-current={active ? 'page' : undefined}
                            className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                                active
                                    ? 'bg-white/10 font-medium text-white'
                                    : 'text-[#f4efe4]/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {active && (
                                <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r bg-gold" />
                            )}
                            <Icon className={active ? 'text-gold' : 'text-[#f4efe4]/50'} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

        </div>
    );
}

function UserMenu() {
    const user = usePage().props.auth.user;

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-serif text-base font-semibold text-forest transition hover:ring-2 hover:ring-forest/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                    aria-label="Account menu"
                >
                    {user.name?.[0]?.toUpperCase()}
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content contentClasses="py-1 bg-paper">
                <div className="border-b border-dashed border-slate-200 px-4 py-3">
                    <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
                <Dropdown.Link href={route('profile.edit')}>Settings</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">
                    Log out
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
                <Sidebar />
            </aside>

            {/* Mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/50"
                        onClick={() => setOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-72 shadow-xl">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute right-3 top-5 z-10 text-[#f4efe4]"
                            aria-label="Close menu"
                        >
                            <CloseIcon />
                        </button>
                        <Sidebar onNavigate={() => setOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header className="flex h-20 items-center gap-3 px-4 sm:px-8">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-md p-1.5 text-slate-700 hover:bg-slate-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        <MenuIcon />
                    </button>
                    <div className="min-w-0 flex-1 [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-medium [&_h1]:tracking-tight [&_h1]:text-forest">
                        {header}
                    </div>
                    <UserMenu />
                </header>

                <main className="mx-auto max-w-6xl px-4 pb-10 sm:px-8">
                    {children}
                </main>
            </div>

            <Toast />
        </div>
    );
}
