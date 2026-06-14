import { useState } from 'react';
import { apiFetch } from '../../shared/apiClient';

export default function ExportForm({ onSuccess }) {
    const [model, setModel] = useState('customers');
    const [format, setFormat] = useState('csv');
    const [message, setMessage] = useState(null);

    const submit = async (e) => {
        e.preventDefault();

        const body = { model, format };
        const response = await apiFetch('/api/exports', {
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
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Export data</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Export</h2>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700">Model</label>
                    <select value={model} onChange={(e) => setModel(e.target.value)} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
                        <option value="customers">Customers</option>
                        <option value="leads">Leads</option>
                        <option value="contacts">Contacts</option>
                        <option value="deals">Deals</option>
                        <option value="tickets">Tickets</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700">Format</label>
                    <select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm">
                        <option value="csv">CSV</option>                        <option value="xlsx">XLSX</option>                    </select>
                </div>

                <button type="submit" className="mt-2 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                    Export data
                </button>

                {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
            </form>
        </section>
    );
}
