import Modal from '@/Components/Modal';
import { Button } from '@/Components/Ui';

export default function ConfirmDialog({
    show,
    title,
    message,
    confirmLabel = 'Delete',
    processing = false,
    onConfirm,
    onCancel,
}) {
    return (
        <Modal show={show} maxWidth="md" onClose={processing ? () => {} : onCancel}>
            <div className="p-6">
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{message}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel} disabled={processing}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm} disabled={processing}>
                        {processing ? 'Deleting…' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
