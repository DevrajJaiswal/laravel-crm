import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import DealForm from './DealForm';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function DealEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            apiFetch('/api/deals/customers').then((response) => response.json()),
            apiFetch(`/api/deals/${id}`).then((response) => response.json()),
        ])
            .then(([customersPayload, dealPayload]) => {
                setCustomers(customersPayload.data || []);
                setValue({
                    customer_id: dealPayload.customer_id || '',
                    title: dealPayload.title || '',
                    amount: dealPayload.amount || '',
                    stage: dealPayload.stage || 'Prospecting',
                    probability: dealPayload.probability ?? 0,
                    expected_close_date: dealPayload.expected_close_date || '',
                    notes: dealPayload.notes || '',
                });
            })
            .catch(() => setError('Failed to load deal'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch(`/api/deals/${id}`, {
                method: 'PUT',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to update deal');
            }

            const payload = await response.json();
            navigate(`/deals/${payload.deal.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !value) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading deal..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    title="Edit Deal"
                    description="Update the deal details and stage."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Deals', href: '/deals' }, { label: 'Edit Deal' }]}

                />

                <Card className="p-5 lg:p-6">
                    <DealForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={saving ? 'Saving...' : 'Save Changes'}
                        loading={saving}
                        error={error}
                        customers={customers}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}

