import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

export default function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        apiFetch(`/api/tickets/${id}`)
            .then((response) => response.json())
            .then(setTicket);
    }, [id]);

    if (!ticket) {
        return <main className="p-6">Loading ticket...</main>;
    }

    const rows = [
        ['Customer', ticket.customer?.company_name || '-'],
        ['Contact', ticket.contact?.name || '-'],
        ['Assigned To', ticket.assigned_to?.name || '-'],
        ['Status', ticket.status],
        ['Priority', ticket.priority],
    ];

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4e6_0%,_#f8fafc_42%,_#e0f2fe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Ticket Details</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">{ticket.subject}</h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to={`/tickets/${ticket.id}/edit`}
                            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800"
                        >
                            Edit
                        </Link>
                        <Link to="/tickets" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                            Back
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {rows.map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{ticket.description}</p>
                </div>

                {ticket.resolution_notes ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Resolution Notes</p>
                        <p className="mt-2 text-sm leading-6 text-emerald-800">{ticket.resolution_notes}</p>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
