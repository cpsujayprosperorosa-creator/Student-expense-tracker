import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AlertIcon, CheckIcon, CloseIcon } from '@/Components/Icons';

// Shows server flash messages (success / error) as dismissible toasts.
export default function Toast() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const message = flash?.success || flash?.error;
        if (!message) return;
        setToast({ message, type: flash.success ? 'success' : 'error' });
        const timer = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed bottom-4 right-4 z-[60] flex max-w-sm items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg"
        >
            <span className={isError ? 'text-red-600' : 'text-emerald-600'}>
                {isError ? <AlertIcon /> : <CheckIcon />}
            </span>
            <p className="text-sm text-slate-800">{toast.message}</p>
            <button
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Dismiss"
            >
                <CloseIcon width={16} height={16} />
            </button>
        </div>
    );
}
