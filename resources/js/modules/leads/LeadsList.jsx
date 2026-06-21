import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Button, DataTable, EmptyState, LoadingState, Modal, ModuleLayout, PageHeader } from '../../components/ui';

export default function LeadsList() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLead, setDeleteLead] = useState(null);

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
        const response = await apiFetch(`/api/leads/${id}`, { method: 'DELETE' });
        if (response.ok) {
            setDeleteLead(null);
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
                    <Button variant="danger" size="sm" onClick={() => setDeleteLead(lead)}>
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
                    actions={
                        <>
                            <Button to="/leads/create">Create Lead</Button>

                        </>
                    }
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

                <Modal open={Boolean(deleteLead)} title="Delete Lead" onClose={() => setDeleteLead(null)}>
                    <div className="space-y-4">
                        <p className="text-sm leading-6 text-slate-600">
                            Delete <span className="font-semibold text-slate-900">{deleteLead?.title}</span>? This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeleteLead(null)}>Cancel</Button>
                            <Button variant="danger" onClick={() => handleDelete(deleteLead.id)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </ModuleLayout>
    );
}

