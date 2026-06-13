import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

const statusColors = {
    Open: 'bg-sky-100 text-sky-800',
    'In Progress': 'bg-amber-100 text-amber-800',
    'Waiting on Customer': 'bg-violet-100 text-violet-800',
    Resolved: 'bg-emerald-100 text-emerald-800',
    Closed: 'bg-slate-100 text-slate-700',
};

export default function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/tickets')
            .then((response) => response.json())
            .then((payload) => setTickets(payload.data || []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4e6_0%,_#f8fafc_42%,_#e0f2fe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Support Tickets</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">Tickets</h1>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/tickets/create" className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
                            Create Ticket
                        </Link>
                        <Link to="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">Loading tickets...</div>
                ) : (
                    <div className="grid gap-4">
                        {tickets.map((ticket) => (
                            <article key={ticket.id} className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-xl font-bold text-slate-950">{ticket.subject}</h2>
                                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${statusColors[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {ticket.customer?.company_name} · {ticket.contact?.name || 'No contact'} · {ticket.priority} priority
                                        </p>
                                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">{ticket.description}</p>
                                    </div>
                                    <Link to={`/tickets/${ticket.id}`} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
