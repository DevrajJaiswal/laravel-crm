import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

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

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Lead Management</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">Leads</h1>
                    </div>
                    <Link to="/leads/create" className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
                        Create Lead
                    </Link>
                </div>

                {loading ? (
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">Loading leads...</div>
                ) : (
                    <div className="grid gap-4">
                        {leads.map((lead) => (
                            <div key={lead.id} className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">{lead.title}</h2>
                                    <p className="mt-1 text-sm text-slate-600">{lead.company_name} · {lead.contact_name}</p>
                                    <p className="mt-1 text-sm text-slate-500">{lead.status} · {lead.source} · {lead.value || 'No value'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/leads/${lead.id}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                        View
                                    </Link>
                                    <Link to={`/leads/${lead.id}/edit`} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(lead.id)}
                                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
