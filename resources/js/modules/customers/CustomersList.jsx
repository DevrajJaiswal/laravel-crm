import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import {
    Badge,
    Button,
    DataTable,
    EmptyState,
    LoadingState,
    ModuleLayout,
    PageHeader,
} from '../../components/ui';

export default function CustomersList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/customers')
            .then((response) => response.json())
            .then((data) => setCustomers(data.data || []))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        {
            key: 'name',
            label: 'Customer',
            render: (customer) => (
                <div>
                    <div className="font-semibold text-slate-950">{customer.name}</div>
                    <div className="text-sm text-slate-500">{customer.company_name}</div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (customer) => <Badge tone="success">{customer.status}</Badge>,
        },
        {
            key: 'industry',
            label: 'Industry',
            render: (customer) => customer.industry || 'Not set',
        },
        {
            key: 'actions',
            label: 'Actions',
            cellClassName: 'w-40',
            render: (customer) => (
                <Button to={`/customers/${customer.id}`} variant="dark" size="sm">
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Customer Management"
                    title="Customers"
                    description="Customer accounts, ownership, and relationship details."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers' }]}
                    actions={
                        <>
                            <Button to="/customers/create">Create Customer</Button>

                        </>
                    }
                />

                {loading ? (
                    <LoadingState label="Loading customers..." />
                ) : customers.length ? (
                    <DataTable columns={columns} data={customers} />
                ) : (
                    <EmptyState
                        title="No customers yet"
                        description="Customers created from won leads or manually added will appear here."
                        actionLabel="Back to dashboard"
                        actionTo="/dashboard"
                    />
                )}
            </div>
        </ModuleLayout>
    );
}

