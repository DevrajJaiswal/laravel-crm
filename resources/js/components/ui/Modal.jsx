import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, title, children, onClose }) {
    useEffect(() => {
        if (!open) return undefined;

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={onClose}>
            <div
                className="mx-auto w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.30)]"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-950">{title}</h2>
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                        Close
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}
