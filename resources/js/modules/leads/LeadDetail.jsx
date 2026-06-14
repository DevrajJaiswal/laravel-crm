import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Badge, Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function LeadDetail() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);

    useEffect(() => {
        apiFetch(`/api/leads/${id}`)
            .then((response) => response.json())
            .then(setLead);
    }, [id]);

    if (!lead) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading lead..." />
            </ModuleLayout>
        );
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
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Lead Details"
                    title={lead.title}
                    description="Review the lead record and conversion status."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Leads', href: '/leads' }, { label: lead.title }]}
                    actions={
                        <>
                            <Button to="/leads" variant="secondary">
                                Back
                            </Button>
                        </>
                    }
                />

                <Card className="mb-6">
                    <div className="mb-6 flex flex-wrap gap-3">
                        <Badge tone="warning">{lead.status}</Badge>
                        <Badge tone="default">{lead.source}</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {rows.map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
                                <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    {lead.notes ? (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Notes</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{lead.notes}</p>
                        </div>
                    ) : null}

                    {lead.status === 'Won' && lead.converted_customer_id ? (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Converted</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">This lead has been converted into a customer.</p>
                            <div className="mt-3">
                                <Button to={`/customers/${lead.converted_customer_id}`} variant="dark">
                                    View Customer
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </Card>
            </div>
        </ModuleLayout>
    );
}
