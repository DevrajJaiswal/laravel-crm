import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';
import TicketForm from './TicketForm';

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
        return <main className="p-6">Loading ticket...</main>;
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4e6_0%,_#f8fafc_42%,_#e0f2fe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <h1 className="mb-6 text-3xl font-black text-slate-950">Edit Ticket</h1>
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
            </div>
        </main>
    );
}
