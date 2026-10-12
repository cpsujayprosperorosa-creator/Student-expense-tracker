import { Link } from '@inertiajs/react';
import { CATEGORY_META, categoryLabel } from '@/lib/format';

export function Card({ title, action, children, className = '', padded = true }) {
    return (
        <section
            className={`rounded-xl border border-slate-200 bg-paper shadow-[0_1px_0_rgba(26,23,18,0.04)] ${className}`}
        >
            {(title || action) && (
                <div className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 px-5 py-4">
                    <h2 className="font-serif text-lg font-medium text-forest">
                        {title}
                    </h2>
                    {action}
                </div>
            )}
            <div className={padded ? 'p-5' : ''}>{children}</div>
        </section>
    );
}

export function StatCard({ label, value, hint, tone = 'default', featured = false }) {
    const toneClass = featured
        ? 'text-white'
        : tone === 'danger'
          ? 'text-red-700'
          : tone === 'good'
            ? 'text-forest-light'
            : 'text-slate-900';
    return (
        <div
            className={`relative overflow-hidden rounded-xl border p-5 ${
                featured
                    ? 'border-forest bg-forest text-[#f4efe4]'
                    : 'border-slate-200 bg-paper'
            }`}
        >
            <p
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    featured ? 'text-gold' : 'text-slate-500'
                }`}
            >
                {label}
            </p>
            <p className={`mt-3 font-serif text-3xl font-medium tabular-nums ${toneClass}`}>
                {value}
            </p>
            {hint && (
                <div className={`mt-1.5 text-xs ${featured ? 'text-[#f4efe4]/70' : 'text-slate-500'}`}>
                    {hint}
                </div>
            )}
        </div>
    );
}

export function CategoryBadge({ category }) {
    const color = CATEGORY_META[category]?.color ?? '#64748b';
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
            />
            {categoryLabel(category)}
        </span>
    );
}

export function EmptyState({ title, description, action }) {
    return (
        <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 rotate-[-4deg] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 font-mono text-xs leading-5 text-slate-400">
                <p>— — — — —</p>
                <p>0.00</p>
                <p>— — — — —</p>
            </div>
            <p className="font-serif text-lg text-forest">{title}</p>
            {description && (
                <p className="mt-1 max-w-xs text-sm text-slate-500">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

const buttonBase =
    'inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
    primary:
        'bg-forest text-[#f4efe4] hover:bg-forest-light focus-visible:ring-forest',
    secondary:
        'border border-slate-300 bg-paper text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
};

export function Button({ variant = 'primary', className = '', ...props }) {
    return (
        <button
            type="button"
            {...props}
            className={`${buttonBase} ${variants[variant]} ${className}`}
        />
    );
}

export function ButtonLink({ variant = 'primary', className = '', ...props }) {
    return (
        <Link
            {...props}
            className={`${buttonBase} ${variants[variant]} ${className}`}
        />
    );
}

export const fieldClass =
    'block w-full rounded-md border-slate-300 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500';

export function Field({ label, error, children, htmlFor }) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1 block text-sm font-medium text-slate-700"
            >
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function ProgressBar({ value, max }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    const over = max > 0 && value > max;
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className={`h-full rounded-full ${over ? 'bg-red-600' : pct > 80 ? 'bg-gold-dark' : 'bg-forest-light'}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

export function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
            {links.map((link, i) => {
                const label = link.label
                    .replace('&laquo; Previous', 'Prev')
                    .replace('Next &raquo;', 'Next');
                const cls = `rounded-md px-3 py-1.5 text-sm ${
                    link.active
                        ? 'bg-slate-900 font-medium text-white'
                        : link.url
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'cursor-not-allowed text-slate-300'
                }`;
                return link.url && !link.active ? (
                    <Link key={i} href={link.url} className={cls} preserveScroll>
                        {label}
                    </Link>
                ) : (
                    <span key={i} className={cls}>
                        {label}
                    </span>
                );
            })}
        </nav>
    );
}
