import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function DealDetail() {
    const { id } = useParams();
    const [deal, setDeal] = useState(null);

    useEffect(() => {
        apiFetch(`/api/deals/${id}`)
            .then((response) => response.json())
            .then(setDeal);
    }, [id]);

    if (!deal) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading deal..." />
            </ModuleLayout>
        );
    }

    const rows = [
        ['Customer', deal.customer?.company_name || '-'],
        ['Amount', deal.amount],
        ['Stage', deal.stage],
        ['Probability', `${deal.probability}%`],
        ['Expected Close', deal.expected_close_date || '-'],
        ['Owner', deal.owner?.name || '-'],
    ];

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Deal Details"
                    title={deal.title}
                    description="Review the pipeline record and deal ownership."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Deals', href: '/deals' }, { label: deal.title }]}
                    actions={
                        <>
                            <Button to={`/deals/${deal.id}/edit`} variant="secondary">
                                Edit
                            </Button>
                            <Button to="/deals" variant="dark">
                                Back
                            </Button>
                        </>
                    }
                />

                <Card>
                    <div className="grid gap-4 md:grid-cols-2">
                        {rows.map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
                                <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    {deal.notes ? (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Notes</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{deal.notes}</p>
                        </div>
                    ) : null}
                </Card>
            </div>
        </ModuleLayout>
    );
}
