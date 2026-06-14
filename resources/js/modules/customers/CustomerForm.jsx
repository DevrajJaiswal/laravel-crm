import { Alert, Button, FormField, Input } from '../../components/ui';

export default function CustomerForm({ value, onChange, onSubmit, submitLabel, loading, error }) {
    const fields = [
        ['name', 'Customer Name'],
        ['company_name', 'Company Name'],
        ['email', 'Email'],
        ['phone', 'Phone'],
        ['status', 'Status'],
        ['industry', 'Industry'],
    ];

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {fields.map(([name, label]) => (
                <FormField key={name} label={label}>
                    <Input
                        type={name === 'email' ? 'email' : 'text'}
                        value={value[name] || ''}
                        onChange={(event) => onChange({ ...value, [name]: event.target.value })}
                    />
                </FormField>
            ))}

            <FormField label="Billing Address">
                <textarea
                    rows="3"
                    value={value.billing_address || ''}
                    onChange={(event) => onChange({ ...value, billing_address: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                />
            </FormField>

            <FormField label="Shipping Address">
                <textarea
                    rows="3"
                    value={value.shipping_address || ''}
                    onChange={(event) => onChange({ ...value, shipping_address: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                />
            </FormField>

            <FormField label="Notes">
                <textarea
                    rows="4"
                    value={value.notes || ''}
                    onChange={(event) => onChange({ ...value, notes: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                />
            </FormField>

            {error ? <Alert tone="danger">{error}</Alert> : null}

            <Button type="submit" className="w-full" disabled={loading}>
                {submitLabel}
            </Button>
        </form>
    );
}
