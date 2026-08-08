import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import LeadForm from './LeadForm';
import { leadSources, leadStatuses } from './leadOptions';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function LeadEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const formId = 'lead-edit-form';
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch(`/api/leads/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setValue({
                    title: data.title || '',
                    company_name: data.company_name || '',
                    contact_name: data.contact_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    source: data.source || leadSources[0],
                    status: data.status || leadStatuses[0],
                    value: data.value || '',
                    notes: data.notes || '',
                });
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch(`/api/leads/${id}`, {
                method: 'PUT',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to update lead');
            }

            navigate(`/leads/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !value) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading lead..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Leads', href: '/leads' }, { label: 'Edit Lead' }]}
                    actions={{
                        back: <Button to="/leads" variant="secondary">Back</Button>,
                        primary: <Button type="submit" form={formId} disabled={saving}>{saving ? 'Saving...' : 'Save Lead'}</Button>,
                    }}

                />

                <Card className="p-5 lg:p-6">
                    <LeadForm
                        formId={formId}
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        error={error}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}
