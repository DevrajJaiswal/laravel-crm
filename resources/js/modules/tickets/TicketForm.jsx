export default function TicketForm({
    value,
    onChange,
    onSubmit,
    submitLabel,
    loading,
    error,
    customers,
    contacts,
    assignees,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</label>
                    <select
                        value={value.customer_id || ''}
                        onChange={(event) => onChange({ ...value, customer_id: event.target.value, contact_id: '' })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
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
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Contact</label>
                    <select
                        value={value.contact_id || ''}
                        onChange={(event) => onChange({ ...value, contact_id: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="">Select contact</option>
                        {contacts.map((contact) => (
                            <option key={contact.id} value={contact.id}>
                                {contact.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Subject</label>
                <input
                    type="text"
                    value={value.subject || ''}
                    onChange={(event) => onChange({ ...value, subject: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Description</label>
                <textarea
                    rows="5"
                    value={value.description || ''}
                    onChange={(event) => onChange({ ...value, description: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Status</label>
                    <select
                        value={value.status || 'Open'}
                        onChange={(event) => onChange({ ...value, status: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        {['Open', 'In Progress', 'Waiting on Customer', 'Resolved', 'Closed'].map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Priority</label>
                    <select
                        value={value.priority || 'Medium'}
                        onChange={(event) => onChange({ ...value, priority: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Assigned To</label>
                <select
                    value={value.assigned_to_user_id || ''}
                    onChange={(event) => onChange({ ...value, assigned_to_user_id: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                >
                    <option value="">Unassigned</option>
                    {assignees.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Resolution Notes</label>
                <textarea
                    rows="4"
                    value={value.resolution_notes || ''}
                    onChange={(event) => onChange({ ...value, resolution_notes: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500"
                />
            </div>

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-rose-600 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}
