import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import LeadForm from './LeadForm';
import { leadSources, leadStatuses } from './leadOptions';
import { Button, Card, ModuleLayout, PageHeader } from '../../components/ui';

export default function LeadCreate() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        title: '',
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        source: leadSources[0],
        status: leadStatuses[0],
        value: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiFetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create lead');
            }

            const payload = await response.json();
            navigate(`/leads/${payload.lead.id}`);
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
                    title="Create Lead"
                    description="Capture a sales opportunity and track it through the pipeline."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Leads', href: '/leads' }, { label: 'Create Lead' }]}

                />

                <Card className="p-5 lg:p-6">
                    <LeadForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={loading ? 'Creating...' : 'Create Lead'}
                        loading={loading}
                        error={error}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}

