import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import DealForm from './DealForm';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

const emptyDeal = {
    customer_id: '',
    title: '',
    amount: '',
    stage: 'Prospecting',
    probability: 0,
    expected_close_date: '',
    notes: '',
};

export default function DealCreate() {
    const navigate = useNavigate();
    const formId = 'deal-create-form';
    const [customers, setCustomers] = useState([]);
    const [value, setValue] = useState(emptyDeal);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch('/api/deals/customers')
            .then((response) => response.json())
            .then((payload) => setCustomers(payload.data || []))
            .catch(() => setError('Failed to load customers'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch('/api/deals', {
                method: 'POST',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create deal');
            }

            const payload = await response.json();
            navigate(`/deals/${payload.deal.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading deal form..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Deals', href: '/deals' }, { label: 'Create' }]}
                    actions={{
                        back: <Button to="/deals" variant="secondary">Back</Button>,
                        primary: <Button type="submit" form={formId} disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>,
                    }}

                />

                <Card className="p-5 lg:p-6">
                    <DealForm
                        formId={formId}
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        error={error}
                        customers={customers}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}
