import { leadSources, leadStatuses } from './leadOptions';

export default function LeadForm({ value, onChange, onSubmit, submitLabel, loading, error }) {
    const fields = [
        ['title', 'Lead Title'],
        ['company_name', 'Company Name'],
        ['contact_name', 'Contact Name'],
        ['email', 'Email'],
        ['phone', 'Phone'],
        ['value', 'Value'],
    ];

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {fields.map(([name, label]) => (
                <div key={name}>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</label>
                    <input
                        type={name === 'email' ? 'email' : name === 'value' ? 'number' : 'text'}
                        value={value[name] || ''}
                        onChange={(event) => onChange({ ...value, [name]: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            ))}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Source</label>
                <select
                    value={value.source || leadSources[0]}
                    onChange={(event) => onChange({ ...value, source: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
                >
                    {leadSources.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Status</label>
                <select
                    value={value.status || leadStatuses[0]}
                    onChange={(event) => onChange({ ...value, status: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
                >
                    {leadStatuses.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Notes</label>
                <textarea
                    rows="4"
                    value={value.notes || ''}
                    onChange={(event) => onChange({ ...value, notes: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>
            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-amber-600 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}
