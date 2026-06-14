import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

export default function ReportPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch('/api/reports/summary')
            .then((response) => response.json())
            .then((payload) => setData(payload.data))
            .catch(() => setError('Unable to load reports.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff5d6_0%,#f7fafc_42%,#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Reports & Analytics</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">CRM Reports Dashboard</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            High-level summary metrics for leads, customers, deals, and tickets.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/dashboard"
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-4xl border border-white/70 bg-white/80 p-8 shadow-sm">Loading reports...</div>
                ) : error ? (
                    <div className="rounded-4xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">{error}</div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Leads</h2>
                            <p className="mt-2 text-sm text-slate-500">Total leads and status distribution.</p>
                            <div className="mt-6 space-y-3 text-sm text-slate-700">
                                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span>Total leads</span>
                                    <span className="font-semibold">{data.leads.total}</span>
                                </div>
                                {Object.entries(data.leads.by_status).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
                                        <span>{status}</span>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Customers</h2>
                            <p className="mt-2 text-sm text-slate-500">Total customers and status breakdown.</p>
                            <div className="mt-6 space-y-3 text-sm text-slate-700">
                                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span>Total customers</span>
                                    <span className="font-semibold">{data.customers.total}</span>
                                </div>
                                {Object.entries(data.customers.by_status).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
                                        <span>{status}</span>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Deals</h2>
                            <p className="mt-2 text-sm text-slate-500">Total deals, pipeline stages, and value.</p>
                            <div className="mt-6 space-y-3 text-sm text-slate-700">
                                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span>Total deals</span>
                                    <span className="font-semibold">{data.deals.total}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
                                    <span>Pipeline value</span>
                                    <span className="font-semibold">${Number(data.deals.value_total).toFixed(2)}</span>
                                </div>
                                {Object.entries(data.deals.by_stage).map(([stage, count]) => (
                                    <div key={stage} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
                                        <span>{stage}</span>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Tickets</h2>
                            <p className="mt-2 text-sm text-slate-500">Ticket volume and status breakdown.</p>
                            <div className="mt-6 space-y-3 text-sm text-slate-700">
                                <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span>Total tickets</span>
                                    <span className="font-semibold">{data.tickets.total}</span>
                                </div>
                                {Object.entries(data.tickets.by_status).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
                                        <span>{status}</span>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
