import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import CustomerForm from './CustomerForm';
import { Button, Card, ModuleLayout, PageHeader } from '../../components/ui';

export default function CustomerCreate() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        status: 'Active',
        industry: '',
        billing_address: '',
        shipping_address: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiFetch('/api/customers', {
                method: 'POST',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create customer');
            }

            const payload = await response.json();
            navigate(`/customers/${payload.customer.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    title="Create Customer"
                    description="Add a customer manually or from a lead conversion."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers', href: '/customers' }, { label: 'Create Customer' }]}

                />

                <Card className="p-5 lg:p-6">
                    <CustomerForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={loading ? 'Creating...' : 'Create Customer'}
                        loading={loading}
                        error={error}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}

