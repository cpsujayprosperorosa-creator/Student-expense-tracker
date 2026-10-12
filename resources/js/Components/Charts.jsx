import { CATEGORY_META, categoryLabel, money } from '@/lib/format';

// Donut chart + legend for spending by category. `data`: [{category, total}]
export function CategoryChart({ data }) {
    const total = data.reduce((s, d) => s + Number(d.total), 0);
    const radius = 15.9155; // circumference ≈ 100
    let offset = 0;

    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-40 w-40 shrink-0">
                <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
                    <circle cx="21" cy="21" r={radius} fill="none" stroke="#ebe4d3" strokeWidth="5" />
                    {data.map((d) => {
                        const pct = (Number(d.total) / total) * 100;
                        const el = (
                            <circle
                                key={d.category}
                                cx="21"
                                cy="21"
                                r={radius}
                                fill="none"
                                stroke={CATEGORY_META[d.category]?.color ?? '#64748b'}
                                strokeWidth="5"
                                strokeDasharray={`${pct} ${100 - pct}`}
                                strokeDashoffset={-offset}
                            />
                        );
                        offset += pct;
                        return el;
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="font-serif text-base font-medium tabular-nums text-forest">
                        {money(total)}
                    </span>
                </div>
            </div>
            <ul className="w-full space-y-2">
                {data.map((d) => (
                    <li key={d.category} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-slate-700">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: CATEGORY_META[d.category]?.color }}
                            />
                            {categoryLabel(d.category)}
                        </span>
                        <span className="tabular-nums text-slate-900">
                            {money(d.total)}
                            <span className="ml-2 text-xs text-slate-500">
                                {Math.round((Number(d.total) / total) * 100)}%
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Vertical bar chart. `data`: [{label, value, marker?}]; marker draws a budget line.
export function BarChart({ data }) {
    const max = Math.max(1, ...data.flatMap((d) => [Number(d.value), Number(d.marker ?? 0)]));

    return (
        <div className="flex h-48 items-end gap-1.5 sm:gap-2" role="img" aria-label="Monthly spending bar chart">
            {data.map((d) => {
                const h = (Number(d.value) / max) * 100;
                const m = d.marker != null ? (Number(d.marker) / max) * 100 : null;
                return (
                    <div key={d.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                        <div className="relative flex w-full flex-1 items-end" title={`${d.label}: ${money(d.value)}`}>
                            <div
                                className="w-full rounded-t bg-forest"
                                style={{ height: `${h}%`, minHeight: Number(d.value) > 0 ? 2 : 0 }}
                            />
                            {m !== null && (
                                <div
                                    className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500"
                                    style={{ bottom: `${m}%` }}
                                />
                            )}
                        </div>
                        <span className="text-[10px] text-slate-500 sm:text-xs">{d.label}</span>
                    </div>
                );
            })}
        </div>
    );
}
