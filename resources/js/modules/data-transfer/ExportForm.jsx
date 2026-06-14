import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Alert, Button, FormField, Select } from '../../components/ui';

export default function ExportForm({ onSuccess }) {
    const [model, setModel] = useState('customers');
    const [format, setFormat] = useState('csv');
    const [message, setMessage] = useState(null);

    const submit = async (e) => {
        e.preventDefault();

        const body = { model, format };
        const response = await apiFetch('/api/data-transfer/exports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => null);
            setMessage(payload?.message ? `Export failed: ${payload.message}` : 'Export request failed.');
            return;
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `crm-${model}-export.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

        setMessage('Export downloaded successfully.');
        onSuccess?.('Export completed successfully.');
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

                <FormField label="Format">
                    <Select value={format} onChange={(e) => setFormat(e.target.value)}>
                        <option value="csv">CSV</option>
                        <option value="xlsx">XLSX</option>
                    </Select>
                </FormField>

                <Button type="submit" variant="dark">
                    Export data
                </Button>

                {message ? <Alert tone="info">{message}</Alert> : null}
            </form>
        </section>
    );
}

