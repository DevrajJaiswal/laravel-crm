import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Button, DataTable, EmptyState, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function LeadsList() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const response = await apiFetch('/api/leads');
            const data = await response.json();
            setLeads(data.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeads();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this lead?')) return;

        const response = await apiFetch(`/api/leads/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadLeads();
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Lead',
            render: (lead) => (
                <div>
                    <div className="font-semibold text-slate-950">{lead.title}</div>
                    <div className="text-sm text-slate-500">{lead.company_name} · {lead.contact_name}</div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (lead) => <Badge tone="warning">{lead.status}</Badge>,
        },
        {
            key: 'source',
            label: 'Source',
            render: (lead) => lead.source,
        },
        {
            key: 'value',
            label: 'Value',
            render: (lead) => lead.value || 'No value',
        },
        {
            key: 'actions',
            label: 'Actions',
            cellClassName: 'w-56',
            render: (lead) => (
                <div className="flex flex-wrap gap-2">
                    <Button to={`/leads/${lead.id}`} variant="secondary" size="sm">
                        View
                    </Button>
                    <Button to={`/leads/${lead.id}/edit`} variant="dark" size="sm">
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(lead.id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Lead Management"
                    title="Leads"
                    description="Track sales opportunities and convert them into customers."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Leads' }]}
                    actions={<Button to="/dashboard" variant="secondary">Back to Dashboard</Button>}
                />

                {loading ? (
                    <LoadingState label="Loading leads..." />
                ) : leads.length ? (
                    <DataTable columns={columns} data={leads} />
                ) : (
                    <EmptyState
                        title="No leads yet"
                        description="Create a lead to start tracking a sales opportunity."
                        actionLabel="Back to dashboard"
                        actionTo="/dashboard"
                    />
                )}
            </div>
        </ModuleLayout>
    );
}
