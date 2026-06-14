export default function FormField({ label, hint, error, required = false, className = '', children }) {
    return (
        <div className={className}>
            {label ? (
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {label}{required ? ' *' : ''}
                </label>
            ) : null}
            {children}
            {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
            {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </div>
    );
}
