import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

export default function LeadDetail() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);

    useEffect(() => {
        apiFetch(`/api/leads/${id}`)
            .then((response) => response.json())
            .then(setLead);
    }, [id]);

    if (!lead) {
        return <main className="p-6">Loading lead...</main>;
    }

    const rows = [
        ['Company', lead.company_name],
        ['Contact', lead.contact_name],
        ['Email', lead.email || '-'],
        ['Phone', lead.phone || '-'],
        ['Source', lead.source],
        ['Status', lead.status],
        ['Value', lead.value || '-'],
        ['Owner', lead.owner?.name || '-'],
    ];

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Lead Details</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">{lead.title}</h1>
                    </div>
                    <Link to="/leads" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        Back
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {rows.map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                            <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                        </div>
                    ))}
                </div>

                {lead.notes ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{lead.notes}</p>
                    </div>
                ) : null}

                {lead.status === 'Won' && lead.converted_customer_id ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Converted</p>
                        <p className="mt-2 text-sm leading-6 text-emerald-800">
                            This lead has been converted into a customer.
                        </p>
                        <Link
                            to={`/customers/${lead.converted_customer_id}`}
                            className="mt-3 inline-flex rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            View Customer
                        </Link>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
