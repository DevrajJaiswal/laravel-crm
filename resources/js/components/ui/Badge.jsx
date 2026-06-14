const toneClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-slate-100 text-slate-700 border-slate-200',
    warning: 'bg-slate-100 text-slate-700 border-slate-200',
    danger: 'bg-slate-100 text-slate-700 border-slate-200',
    info: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Badge({ tone = 'default', className = '', children }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.default} ${className}`}>
            {children}
        </span>
    );
}
