export default function LoadingState({ label = 'Loading...' }) {
    return (
        <div className="flex min-h-[240px] w-full items-center justify-center rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface)] p-6 text-sm text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-slate-700" />
                {label}
            </div>
        </div>
    );
}
