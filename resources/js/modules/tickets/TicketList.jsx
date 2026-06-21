import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Button, DataTable, EmptyState, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/tickets')
            .then((response) => response.json())
            .then((payload) => setTickets(payload.data || []))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        {
            key: 'subject',
            label: 'Ticket',
            render: (ticket) => (
                <div>
                    <div className="font-semibold text-slate-950">{ticket.subject}</div>
                    <div className="text-sm text-slate-500">
                        {ticket.customer?.company_name} · {ticket.contact?.name || 'No contact'}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (ticket) => <Badge tone="info">{ticket.status}</Badge>,
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (ticket) => ticket.priority,
        },
        {
            key: 'actions',
            label: 'Actions',
            cellClassName: 'w-40',
            render: (ticket) => (
                <Button to={`/tickets/${ticket.id}`} variant="dark" size="sm">
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Support Tickets"
                    title="Tickets"
                    description="Track customer issues, status, priority, and ownership."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tickets' }]}
                    actions={
                        <>
                            <Button to="/tickets/create">Create Ticket</Button>

                        </>
                    }
                />

                {loading ? (
                    <LoadingState label="Loading tickets..." />
                ) : tickets.length ? (
                    <DataTable columns={columns} data={tickets} />
                ) : (
                    <EmptyState
                        title="No tickets yet"
                        description="Tickets created here will appear in the support workflow."
                        actionLabel="Back to dashboard"
                        actionTo="/dashboard"
                    />
                )}
            </div>
        </ModuleLayout>
    );
}

