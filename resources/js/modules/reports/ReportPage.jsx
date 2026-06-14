import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader, StatCard } from '../../components/ui';

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
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Reports & Analytics"
                    title="CRM Reports Dashboard"
                    description="High-level summary metrics for leads, customers, deals, and tickets."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reports' }]}
                    actions={<Button to="/dashboard" variant="secondary">Back to Dashboard</Button>}
                />

                {loading ? (
                    <LoadingState label="Loading reports..." />
                ) : error ? (
                    <Card>{error}</Card>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <StatCard label="Total Leads" value={data.leads.total} detail="All leads in the CRM." />
                        <StatCard label="Total Customers" value={data.customers.total} detail="All customer accounts." />
                        <StatCard label="Total Deals" value={data.deals.total} detail="Sales pipeline records." />
                        <StatCard label="Total Tickets" value={data.tickets.total} detail="Support workload." />

                        <Card className="lg:col-span-2">
                            <div className="grid gap-6 md:grid-cols-2">
                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900">Leads</h2>
                                    <div className="mt-4 space-y-3 text-sm text-slate-700">
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

                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900">Customers</h2>
                                    <div className="mt-4 space-y-3 text-sm text-slate-700">
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

                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900">Deals</h2>
                                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                                        <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
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

                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900">Tickets</h2>
                                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                                        {Object.entries(data.tickets.by_status).map(([status, count]) => (
                                            <div key={status} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3">
                                                <span>{status}</span>
                                                <span className="font-semibold">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
