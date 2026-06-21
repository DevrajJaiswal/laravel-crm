import { createPortal } from 'react-dom';
import { useContext } from 'react';
import { LoadingStateContext } from '../../layouts/ModuleLayout';

export default function LoadingState({ label = 'Loading...', variant }) {
    const contextVariant = useContext(LoadingStateContext);
    const resolvedVariant = variant ?? contextVariant ?? 'card';
    if (resolvedVariant === 'overlay') {
        const overlay = (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm">
                <div className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface)] px-6 py-4 text-sm text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.12)]">
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 animate-pulse rounded-full bg-slate-700" />
                        {label}
                    </div>
                </div>
            </div>
        );

        return typeof document !== 'undefined' ? createPortal(overlay, document.body) : overlay;
    }

    return (
        <div className="flex min-h-[240px] w-full items-center justify-center rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface)] p-6 text-sm text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-slate-700" />
                {label}
            </div>
        </div>
    );
}
