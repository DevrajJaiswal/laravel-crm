import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Alert, Button, FormField, Select } from '../../components/ui';

export default function ImportForm({ onSuccess }) {
    const [file, setFile] = useState(null);
    const [model, setModel] = useState('customers');
    const [message, setMessage] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        if (!file) return setMessage('Select a CSV or XLSX file');

        const fd = new FormData();
        fd.append('file', file);
        fd.append('model', model);

        const resp = await apiFetch('/api/data-transfer/imports', { method: 'POST', body: fd });
        if (resp.ok) {
            setMessage('Import queued successfully.');
            setFile(null);
            onSuccess?.('Import queued successfully.');
        } else {
            const payload = await resp.json().catch(() => null);
            setMessage(payload?.message ? `Import failed: ${payload.message}` : 'Import failed.');
        }
    };

    return (
        <section className="space-y-5">
            <form onSubmit={submit} className="space-y-4">
                <FormField label="Model">
                    <Select value={model} onChange={(e) => setModel(e.target.value)}>
                        <option value="customers">Customers</option>
                        <option value="leads">Leads</option>
                        <option value="contacts">Contacts</option>
                        <option value="deals">Deals</option>
                        <option value="tickets">Tickets</option>
                    </Select>
                </FormField>

                <FormField label="File (CSV or XLSX)">
                    <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                    />
                </FormField>

                <Button type="submit" variant="primary">
                    Import Data
                </Button>

                {message ? <Alert tone="info">{message}</Alert> : null}
            </form>
        </section>
    );
}

