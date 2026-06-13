export default function DealForm({
    value,
    onChange,
    onSubmit,
    submitLabel,
    loading,
    error,
    customers,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</label>
                <select
                    value={value.customer_id || ''}
                    onChange={(event) => onChange({ ...value, customer_id: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Deal Title</label>
                <input
                    type="text"
                    value={value.title || ''}
                    onChange={(event) => onChange({ ...value, title: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={value.amount || ''}
                        onChange={(event) => onChange({ ...value, amount: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Probability</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={value.probability || ''}
                        onChange={(event) => onChange({ ...value, probability: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Stage</label>
                    <select
                        value={value.stage || 'Prospecting'}
                        onChange={(event) => onChange({ ...value, stage: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((stage) => (
                            <option key={stage} value={stage}>
                                {stage}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Expected Close Date</label>
                    <input
                        type="date"
                        value={value.expected_close_date || ''}
                        onChange={(event) => onChange({ ...value, expected_close_date: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Notes</label>
                <textarea
                    rows="4"
                    value={value.notes || ''}
                    onChange={(event) => onChange({ ...value, notes: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-sky-600 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}
