import { useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';

export default function ConfirmActionModal({
    open,
    title,
    description,
    confirmLabel,
    loading = false,
    onConfirm,
    onCancel,
}) {
    const dialogRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const confirmButtonRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancel();
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            const focusable = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean);
            const currentIndex = focusable.indexOf(document.activeElement);

            if (currentIndex === -1) {
                focusable[0]?.focus();
                event.preventDefault();
                return;
            }

            const nextIndex = event.shiftKey
                ? (currentIndex - 1 + focusable.length) % focusable.length
                : (currentIndex + 1) % focusable.length;

            focusable[nextIndex]?.focus();
            event.preventDefault();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onCancel]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4" role="presentation">
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-action-title"
                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
                <h3 id="confirm-action-title" className="text-xl font-semibold text-slate-900">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button ref={cancelButtonRef} type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button ref={confirmButtonRef} type="button" variant="danger" loading={loading} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}