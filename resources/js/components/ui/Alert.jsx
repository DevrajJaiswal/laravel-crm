const toneClasses = {
    success: 'border-slate-200 bg-slate-50 text-slate-800',
    warning: 'border-slate-200 bg-slate-50 text-slate-800',
    danger: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-slate-200 bg-slate-50 text-slate-800',
};

export default function Alert({ tone = 'info', title, children, className = '' }) {
    return (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone] || toneClasses.info} ${className}`}>
            {title ? <p className="mb-1 font-semibold">{title}</p> : null}
            <div>{children}</div>
        </div>
    );
}
