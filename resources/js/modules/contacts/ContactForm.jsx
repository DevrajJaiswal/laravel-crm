export default function ContactForm({ value, onChange, onSubmit, submitLabel, loading, error, onCancel, mode }) {
    const fields = [
        ['first_name', 'First Name'],
        ['last_name', 'Last Name'],
        ['email', 'Email'],
        ['phone', 'Phone'],
        ['job_title', 'Job Title'],
    ];

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                {fields.map(([name, label]) => (
                    <div key={name} className={name === 'job_title' ? 'md:col-span-2' : ''}>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</label>
                        <input
                            type={name === 'email' ? 'email' : 'text'}
                            value={value[name] || ''}
                            onChange={(event) => onChange({ ...value, [name]: event.target.value })}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                        />
                    </div>
                ))}
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input
                    type="checkbox"
                    checked={Boolean(value.is_primary)}
                    onChange={(event) => onChange({ ...value, is_primary: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
                Primary Contact
            </label>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Notes</label>
                <textarea
                    rows="4"
                    value={value.notes || ''}
                    onChange={(event) => onChange({ ...value, notes: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                />
            </div>

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50"
                >
                    {submitLabel}
                </button>
                {mode === 'edit' ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-wider text-slate-700"
                    >
                        Cancel
                    </button>
                ) : null}
            </div>
        </form>
    );
}
