import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

export default function CustomersList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/customers')
            .then((response) => response.json())
            .then((data) => setCustomers(data.data || []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Customer Management</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">Customers</h1>
                    </div>
                    <Link to="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        Back to dashboard
                    </Link>
                </div>

                <div className="mb-4">
                    <Link to="/customers/create" className="inline-flex rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">
                        Create Customer
                    </Link>
                </div>

                {loading ? (
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">Loading customers...</div>
                ) : (
                    <div className="grid gap-4">
                        {customers.map((customer) => (
                            <div key={customer.id} className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">{customer.name}</h2>
                                    <p className="mt-1 text-sm text-slate-600">{customer.company_name}</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {customer.status} · {customer.industry || 'Industry not set'}
                                    </p>
                                </div>
                                <Link to={`/customers/${customer.id}`} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
