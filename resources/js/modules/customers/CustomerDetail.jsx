import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';
import CustomerContactsSection from '../contacts/CustomerContactsSection';

export default function CustomerDetail() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        apiFetch(`/api/customers/${id}`)
            .then((response) => response.json())
            .then(setCustomer);
    }, [id]);

    if (!customer) {
        return <main className="p-6">Loading customer...</main>;
    }

    const rows = [
        ['Company', customer.company_name],
        ['Email', customer.email || '-'],
        ['Phone', customer.phone || '-'],
        ['Status', customer.status],
        ['Industry', customer.industry || '-'],
        ['Billing Address', customer.billing_address || '-'],
        ['Shipping Address', customer.shipping_address || '-'],
        ['Owner', customer.owner?.name || '-'],
    ];

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Customer Details</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">{customer.name}</h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to={`/customers/${customer.id}/edit`}
                            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800"
                        >
                            Edit
                        </Link>
                        <Link to="/customers" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
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

                {customer.notes ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{customer.notes}</p>
                    </div>
                ) : null}

                {customer.converted_from_lead_id ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Converted from Lead</p>
                        <p className="mt-2 text-sm leading-6 text-emerald-800">
                            This customer was created automatically from a won lead.
                        </p>
                    </div>
                ) : null}

                <CustomerContactsSection customerId={customer.id} />
            </div>
        </main>
    );
}
