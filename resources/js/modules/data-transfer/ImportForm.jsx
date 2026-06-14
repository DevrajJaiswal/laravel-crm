import { useState } from 'react';
import { apiFetch } from '../../shared/apiClient';

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
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Import data</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Import</h2>
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
                    <label className="block text-sm font-semibold text-slate-700">File (CSV or XLSX)</label>
                    <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm" />
                </div>

                <button type="submit" className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                    Import Data
                </button>

                {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
            </form>
        </section>
    );
}

