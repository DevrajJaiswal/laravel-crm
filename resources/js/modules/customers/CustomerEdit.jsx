import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import CustomerForm from './CustomerForm';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function CustomerEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch(`/api/customers/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setValue({
                    name: data.name || '',
                    company_name: data.company_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    status: data.status || 'Active',
                    industry: data.industry || '',
                    billing_address: data.billing_address || '',
                    shipping_address: data.shipping_address || '',
                    notes: data.notes || '',
                });
            })
            .catch(() => setError('Failed to load customer'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch(`/api/customers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to update customer');
            }

            const payload = await response.json();
            navigate(`/customers/${payload.customer.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !value) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading customer..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full max-w-4xl space-y-6">
                <PageHeader
                    eyebrow="Customer Management"
                    title="Edit Customer"
                    description="Update the customer profile, addresses, and notes."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers', href: '/customers' }, { label: 'Edit Customer' }]}
                    actions={<Button to="/customers" variant="secondary">Back to Customers</Button>}
                />

                <Card className="p-8">
                    <CustomerForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={saving ? 'Saving...' : 'Save Changes'}
                        loading={saving}
                        error={error}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}
