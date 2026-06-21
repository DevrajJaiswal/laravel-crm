import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Card, LoadingState } from '../../components/ui';

function normalizeImport(item) {
    return {
        ...item,
        type: 'Import',
        rowsSummary: `${item.rows_processed ?? 0}/${item.rows_total ?? 0}`,
        title: item.model,
        statusText: item.status?.replaceAll('_', ' ') ?? 'queued',
        errorCount: item.errors?.length ?? 0,
    };
}

function normalizeExport(item) {
    return {
        ...item,
        type: 'Export',
        rowsSummary: `${item.rows_exported ?? 0}/${item.rows_total ?? 0}`,
        title: item.model,
        statusText: item.status?.replaceAll('_', ' ') ?? 'completed',
        errorCount: item.errors?.length ?? 0,
    };
}

export default function DataTransferHistoryList({ mode = 'all' }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiFetch('/api/data-transfer/imports').then((r) => r.json()),
            apiFetch('/api/data-transfer/exports').then((r) => r.json()),
        ])
            .then(([importsPayload, exportsPayload]) => {
                const imports = (importsPayload.data || []).map(normalizeImport);
                const exports = (exportsPayload.data || []).map(normalizeExport);
                setHistory([...imports, ...exports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if (mode === 'imports') return history.filter((item) => item.type === 'Import');
        if (mode === 'exports') return history.filter((item) => item.type === 'Export');
        return history;
    }, [history, mode]);

    return loading ? (
        <LoadingState label="Loading data transfer history..." />
    ) : filtered.length ? (
        <div className="space-y-3">
            {filtered.map((item) => (
                <Card key={`${item.type}-${item.id}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                {mode === 'all' ? `${item.type} • ${item.title}` : item.title}
                            </div>
                            <div className="mt-2 text-lg font-bold text-slate-950">{item.statusText}</div>
                        </div>
                        <Badge tone="default">{item.rowsSummary} rows</Badge>
                    </div>
                    {item.errorCount ? (
                        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {item.errorCount} error(s) in this job
                        </div>
                    ) : null}
                </Card>
            ))}
        </div>
    ) : (
        <Card className="text-sm text-slate-500">No {mode === 'all' ? 'import or export' : mode.slice(0, -1)} history yet.</Card>
    );
}
