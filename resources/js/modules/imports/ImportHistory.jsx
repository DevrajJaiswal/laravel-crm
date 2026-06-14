import { useEffect, useState } from 'react';
import { apiFetch } from '../../shared/apiClient';

export default function ImportHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiFetch('/api/imports').then((r) => r.json()),
            apiFetch('/api/exports').then((r) => r.json()),
        ])
            .then(([importsPayload, exportsPayload]) => {
                const imports = (importsPayload.data || []).map((item) => ({
                    ...item,
                    type: 'Import',
                    rowsSummary: `${item.rows_processed ?? 0}/${item.rows_total ?? 0}`,
                    title: item.model,
                    statusText: item.status?.replaceAll('_', ' ') ?? 'queued',
                    errorCount: item.errors?.length ?? 0,
                }));
                const exports = (exportsPayload.data || []).map((item) => ({
                    ...item,
                    type: 'Export',
                    rowsSummary: `${item.rows_exported ?? 0}/${item.rows_total ?? 0}`,
                    title: item.model,
                    statusText: item.status?.replaceAll('_', ' ') ?? 'completed',
                    errorCount: item.errors?.length ?? 0,
                }));

                setHistory([...imports, ...exports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Data transfer history</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">Data Transfer History</h2>
                <p className="mt-2 text-sm text-slate-600">Review recent import and export jobs for this account.</p>
            </div>
            <div className="mt-6 space-y-4">
                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">Loading data transfer history...</div>
                ) : history.length ? (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{item.type} · {item.title}</div>
                                        <div className="mt-2 text-lg font-bold text-slate-950">{item.statusText}</div>
                                    </div>
                                    <div className="text-sm text-slate-500">{item.rowsSummary} rows</div>
                                </div>
                                {item.errorCount ? (
                                    <div className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
                                        {item.errorCount} error(s) during {item.type.toLowerCase()}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">No import or export history yet.</div>
                )}
            </div>
        </div>
    );
}
