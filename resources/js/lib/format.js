const currency = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
});

export const money = (value) => currency.format(Number(value ?? 0));

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// Parse "YYYY-MM-DD" (optionally with a time part) without timezone shifts.
export const formatDate = (value) => {
    if (!value) return '';
    const [y, m, d] = String(value).slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const CATEGORY_META = {
    food: { label: 'Food', color: '#c2751a' },
    transportation: { label: 'Transportation', color: '#2f7a8c' },
    school: { label: 'School', color: '#143d2f' },
    bills: { label: 'Bills', color: '#a4372b' },
    personal: { label: 'Personal', color: '#7b5ea7' },
    entertainment: { label: 'Entertainment', color: '#c2557a' },
    other: { label: 'Other', color: '#8a8372' },
};

export const categoryLabel = (c) => CATEGORY_META[c]?.label ?? c;

export const titleCase = (s) =>
    String(s ?? '').replace(/\b\w/g, (c) => c.toUpperCase());
