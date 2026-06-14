import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Card, LoadingState, PageHeader } from '../../components/ui';

export default function ImportHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiFetch('/api/data-transfer/imports').then((r) => r.json()),
            apiFetch('/api/data-transfer/exports').then((r) => r.json()),
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
        <div className="space-y-6">
            <PageHeader
                eyebrow="Data transfer history"
                title="Data Transfer History"
                description="Review recent import and export jobs for this account."
            />

            <div className="space-y-4">
                {loading ? (
                    <LoadingState label="Loading data transfer history..." />
                ) : history.length ? (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <Card key={`${item.type}-${item.id}`}>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            {item.type} · {item.title}
                                        </div>
                                        <div className="mt-2 text-lg font-bold text-slate-950">{item.statusText}</div>
                                    </div>
                                    <Badge tone="default">{item.rowsSummary} rows</Badge>
                                </div>
                                {item.errorCount ? (
                                    <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {item.errorCount} error(s) during {item.type.toLowerCase()}
                                    </div>
                                ) : null}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-sm text-slate-500">No import or export history yet.</Card>
                )}
            </div>
        </div>
    );
}
