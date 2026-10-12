import { Link } from '@inertiajs/react';

// Decorative sample only — illustrates what the app tracks; not real data.
const SAMPLE = [
    ['Iced coffee', '2.80'],
    ['Chem textbook', '24.00'],
    ['Bus pass', '12.00'],
    ['Streaming', '5.99'],
    ['Printing', '3.50'],
];

const zigzag = {
    height: 14,
    backgroundImage:
        'linear-gradient(135deg, transparent 7px, #fffdf8 0), linear-gradient(225deg, transparent 7px, #fffdf8 0)',
    backgroundSize: '14px 14px',
};

function Receipt() {
    return (
        <div className="relative w-full max-w-xs rotate-[-2.5deg] drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)]">
            <div className="bg-[#fffdf8] px-6 pb-4 pt-6 font-mono text-[13px] text-stone-800">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-stone-500">
                    This week
                </p>
                <p className="mt-1 text-center text-[11px] text-stone-400">sample receipt</p>

                <div className="my-4 border-t border-dashed border-stone-300" />

                <ul className="space-y-2">
                    {SAMPLE.map(([name, amt]) => (
                        <li key={name} className="flex items-baseline justify-between gap-2">
                            <span>{name}</span>
                            <span className="flex-1 border-b border-dotted border-stone-300" />
                            <span className="tabular-nums">{amt}</span>
                        </li>
                    ))}
                </ul>

                <div className="my-4 border-t border-dashed border-stone-300" />

                <div className="flex items-baseline justify-between font-semibold">
                    <span>TOTAL</span>
                    <span className="tabular-nums">48.29</span>
                </div>

                <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
                        <div className="h-full w-[32%] rounded-full bg-[#1f5c45]" />
                    </div>
                    <p className="mt-1.5 text-[11px] text-stone-500">32% of monthly budget used</p>
                </div>
            </div>
            <div style={zigzag} aria-hidden="true" />
        </div>
    );
}

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="grid min-h-screen bg-[#f4efe4] lg:grid-cols-[1.05fr_1fr]">
            {/* Brand panel */}
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#143d2f] p-12 text-[#f4efe4] lg:flex">
                {/* ruled-ledger lines */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(to bottom, transparent 0 31px, #fff 31px 32px)',
                    }}
                />

                <Link href="/" className="relative font-serif text-xl tracking-tight">
                    Pocket<span className="italic text-[#e9b44c]">Ledger</span>
                </Link>

                <div className="relative flex flex-col items-center gap-12 xl:flex-row xl:items-center">
                    <div className="max-w-sm">
                        <h2 className="font-serif text-4xl leading-[1.1] xl:text-5xl">
                            Every peso, dollar and dime —{' '}
                            <span className="italic text-[#e9b44c]">accounted for.</span>
                        </h2>
                        <p className="mt-5 text-sm leading-relaxed text-[#f4efe4]/70">
                            A calm little ledger for student life. Log what you spend, set a
                            monthly limit, and see where your allowance really goes.
                        </p>
                    </div>
                    <Receipt />
                </div>

                <p className="relative text-xs text-[#f4efe4]/50">
                    Your records stay private to your account.
                </p>
            </aside>

            {/* Form panel */}
            <main className="flex flex-col px-6 py-8 sm:px-14">
                <Link
                    href="/"
                    className="font-serif text-xl tracking-tight text-[#143d2f] lg:invisible"
                >
                    Pocket<span className="italic text-[#b9791a]">Ledger</span>
                </Link>

                <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
                    {title && (
                        <div className="mb-9">
                            <h1 className="font-serif text-4xl text-[#143d2f]">{title}</h1>
                            {subtitle && (
                                <p className="mt-2 text-sm text-stone-600">{subtitle}</p>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
