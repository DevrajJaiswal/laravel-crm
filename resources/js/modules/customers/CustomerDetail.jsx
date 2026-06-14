import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import {
    Badge,
    Button,
    Card,
    ContentSection,
    LoadingState,
    ModuleLayout,
    PageHeader,
} from '../../components/ui';
import CustomerContactsSection from '../contacts/CustomerContactsSection';
import CustomerActivitiesSection from '../activities/CustomerActivitiesSection';

export default function CustomerDetail() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        apiFetch(`/api/customers/${id}`)
            .then((response) => response.json())
            .then(setCustomer);
    }, [id]);

    if (!customer) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading customer..." />
            </ModuleLayout>
        );
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
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Customer Details"
                    title={customer.name}
                    description="View the account record, related contacts, and activity timeline."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers', href: '/customers' }, { label: customer.name }]}
                    actions={
                        <>
                            <Button to={`/customers/${customer.id}/edit`} variant="secondary">
                                Edit
                            </Button>
                            <Button to="/customers" variant="dark">
                                Back
                            </Button>
                        </>
                    }
                />

                <Card className="mb-6">
                    <div className="mb-6 flex flex-wrap gap-3">
                        <Badge tone="success">{customer.status}</Badge>
                        {customer.converted_from_lead_id ? <Badge tone="info">Converted from lead</Badge> : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {rows.map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
                                <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    {customer.notes ? (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Notes</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{customer.notes}</p>
                        </div>
                    ) : null}
                </Card>

                <ContentSection title="Contacts" description="Contacts linked to this customer.">
                    <CustomerContactsSection customerId={customer.id} />
                </ContentSection>

                <div className="h-6" />

                <ContentSection title="Activities" description="Calls, meetings, emails, and notes on the customer timeline.">
                    <CustomerActivitiesSection customerId={customer.id} />
                </ContentSection>
            </div>
        </ModuleLayout>
    );
}
