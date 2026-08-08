import { Button } from '../../components/ui';

export default function ActivityForm({ value, onChange, onSubmit, submitLabel, loading, error, onCancel, mode }) {
    const types = ['Call', 'Meeting', 'Email'];

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Type</label>
                <select
                    value={value.type || 'Call'}
                    onChange={(event) => onChange({ ...value, type: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                >
                    {types.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Subject</label>
                <input
                    type="text"
                    value={value.subject || ''}
                    onChange={(event) => onChange({ ...value, subject: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                />
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Occurred At</label>
                <input
                    type="datetime-local"
                    value={value.occurred_at || ''}
                    onChange={(event) => onChange({ ...value, occurred_at: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                />
            </div>

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
                <Button type="submit" disabled={loading}>
                    {submitLabel}
                </Button>
                {mode === 'edit' ? (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                ) : null}
            </div>
        </form>
    );
}
