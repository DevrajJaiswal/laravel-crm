import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        apiFetch(`/api/tickets/${id}`)
            .then((response) => response.json())
            .then(setTicket);
    }, [id]);

    if (!ticket) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading ticket..." />
            </ModuleLayout>
        );
    }

    const rows = [
        ['Customer', ticket.customer?.company_name || '-'],
        ['Contact', ticket.contact?.name || '-'],
        ['Assigned To', ticket.assigned_to?.name || '-'],
        ['Status', ticket.status],
        ['Priority', ticket.priority],
    ];

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Ticket Details"
                    title={ticket.subject}
                    description="Review support case details, assignment, and resolution notes."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tickets', href: '/tickets' }, { label: ticket.subject }]}
                    actions={
                        <>
                            <Button to={`/tickets/${ticket.id}/edit`} variant="secondary">
                                Edit
                            </Button>
                            <Button to="/tickets" variant="dark">
                                Back
                            </Button>
                        </>
                    }
                />

                <Card className="mb-6">
                    <div className="mb-6 flex flex-wrap gap-3">
                        <Badge tone="info">{ticket.status}</Badge>
                        <Badge tone="warning">{ticket.priority}</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {rows.map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
                                <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Description</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{ticket.description}</p>
                    </div>

                    {ticket.resolution_notes ? (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Resolution Notes</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{ticket.resolution_notes}</p>
                        </div>
                    ) : null}
                </Card>
            </div>
        </ModuleLayout>
    );
}
