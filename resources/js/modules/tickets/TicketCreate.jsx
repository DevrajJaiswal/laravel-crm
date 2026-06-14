import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import TicketForm from './TicketForm';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

const emptyTicket = {
    customer_id: '',
    contact_id: '',
    assigned_to_user_id: '',
    subject: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    resolution_notes: '',
};

export default function TicketCreate() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [value, setValue] = useState(emptyTicket);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            apiFetch('/api/tickets/customers').then((response) => response.json()),
            apiFetch('/api/tickets/assignees').then((response) => response.json()),
        ])
            .then(([customersPayload, assigneesPayload]) => {
                setCustomers(customersPayload.data || []);
                setAssignees(assigneesPayload.data || []);
            })
            .catch(() => setError('Failed to load ticket form data'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!value.customer_id) {
            setContacts([]);
            return;
        }

        apiFetch(`/api/tickets/customers/${value.customer_id}/contacts`)
            .then((response) => response.json())
            .then((payload) => setContacts(payload.data || []));
    }, [value.customer_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch('/api/tickets', {
                method: 'POST',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create ticket');
            }

            const payload = await response.json();
            navigate(`/tickets/${payload.ticket.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading ticket form..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full max-w-4xl space-y-6">
                <PageHeader
                    eyebrow="Support Tickets"
                    title="Create Ticket"
                    description="Open a support issue and route it to the right owner."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tickets', href: '/tickets' }, { label: 'Create Ticket' }]}
                    actions={<Button to="/tickets" variant="secondary">Back to Tickets</Button>}
                />

                <Card className="p-8">
                    <TicketForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={saving ? 'Creating...' : 'Create Ticket'}
                        loading={saving}
                        error={error}
                        customers={customers}
                        contacts={contacts}
                        assignees={assignees}
                    />
                </Card>
            </div>
        </ModuleLayout>
    );
}
