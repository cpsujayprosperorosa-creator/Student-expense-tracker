import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const input =
    'block w-full border-0 border-b-2 border-stone-300 bg-transparent px-0 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-[#143d2f] focus:ring-0';

function Row({ label, htmlFor, error, children }) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="text-xs font-semibold uppercase tracking-widest text-stone-500"
            >
                {label}
            </label>
            {children}
            {error && <p className="mt-1.5 text-sm text-red-700">{error}</p>}
        </div>
    );
}

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout title="Welcome back." subtitle="Open your ledger and pick up where you left off.">
            <Head title="Log in" />

            {status && (
                <div className="mb-6 border-l-4 border-[#1f5c45] bg-[#1f5c45]/10 px-3 py-2 text-sm text-[#143d2f]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-7">
                <Row label="Email" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={input}
                        autoComplete="username"
                        autoFocus
                        placeholder="you@school.edu"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </Row>

                <Row label="Password" htmlFor="password" error={errors.password}>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={input}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </Row>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-stone-600">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-sm border-stone-400 text-[#143d2f] focus:ring-[#143d2f]"
                        />
                        Keep me signed in
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-stone-600 underline decoration-stone-400 underline-offset-4 hover:text-[#143d2f]"
                        >
                            Forgot it?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="group flex w-full items-center justify-between rounded-md bg-[#143d2f] px-5 py-3.5 text-sm font-semibold text-[#f4efe4] transition hover:bg-[#1f5c45] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#143d2f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe4] disabled:opacity-60"
                >
                    <span>{processing ? 'Opening ledger…' : 'Open my ledger'}</span>
                    <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                        →
                    </span>
                </button>
            </form>

            <p className="mt-8 text-sm text-stone-600">
                No ledger yet?{' '}
                <Link
                    href={route('register')}
                    className="font-semibold text-[#143d2f] underline underline-offset-4"
                >
                    Start one — it’s free
                </Link>
            </p>
        </GuestLayout>
    );
}
