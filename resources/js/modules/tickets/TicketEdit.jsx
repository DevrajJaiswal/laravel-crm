import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import TicketForm from './TicketForm';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function TicketEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            apiFetch('/api/tickets/customers').then((response) => response.json()),
            apiFetch('/api/tickets/assignees').then((response) => response.json()),
            apiFetch(`/api/tickets/${id}`).then((response) => response.json()),
        ])
            .then(([customersPayload, assigneesPayload, ticketPayload]) => {
                setCustomers(customersPayload.data || []);
                setAssignees(assigneesPayload.data || []);
                setValue({
                    customer_id: ticketPayload.customer_id || '',
                    contact_id: ticketPayload.contact_id || '',
                    assigned_to_user_id: ticketPayload.assigned_to_user_id || '',
                    subject: ticketPayload.subject || '',
                    description: ticketPayload.description || '',
                    status: ticketPayload.status || 'Open',
                    priority: ticketPayload.priority || 'Medium',
                    resolution_notes: ticketPayload.resolution_notes || '',
                });

                if (ticketPayload.customer_id) {
                    return apiFetch(`/api/tickets/customers/${ticketPayload.customer_id}/contacts`)
                        .then((response) => response.json())
                        .then((payload) => setContacts(payload.data || []));
                }

                return null;
            })
            .catch(() => setError('Failed to load ticket'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!value?.customer_id) {
            setContacts([]);
            return;
        }

        apiFetch(`/api/tickets/customers/${value.customer_id}/contacts`)
            .then((response) => response.json())
            .then((payload) => setContacts(payload.data || []));
    }, [value?.customer_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch(`/api/tickets/${id}`, {
                method: 'PUT',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to update ticket');
            }

            const payload = await response.json();
            navigate(`/tickets/${payload.ticket.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !value) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading ticket..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    title="Edit Ticket"
                    description="Update ticket routing, priority, and resolution notes."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tickets', href: '/tickets' }, { label: 'Edit Ticket' }]}

                />

                <Card className="p-5 lg:p-6">
                    <TicketForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={saving ? 'Saving...' : 'Save Changes'}
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

