import { leadSources, leadStatuses } from './leadOptions';
import { Alert, Button, FormField, Input, Select } from '../../components/ui';

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
                <FormField key={name} label={label}>
                    <Input
                        type={name === 'email' ? 'email' : name === 'value' ? 'number' : 'text'}
                        value={value[name] || ''}
                        onChange={(event) => onChange({ ...value, [name]: event.target.value })}
                    />
                </FormField>
            ))}

            <FormField label="Source">
                <Select
                    value={value.source || leadSources[0]}
                    onChange={(event) => onChange({ ...value, source: event.target.value })}
                >
                    {leadSources.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </FormField>

            <FormField label="Status">
                <Select
                    value={value.status || leadStatuses[0]}
                    onChange={(event) => onChange({ ...value, status: event.target.value })}
                >
                    {leadStatuses.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
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
