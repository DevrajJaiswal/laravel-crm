import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import ContactForm from './ContactForm';

const emptyContact = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    is_primary: false,
    notes: '',
};

export default function CustomerContactsSection({ customerId }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const [value, setValue] = useState(emptyContact);

    const editingContact = useMemo(
        () => contacts.find((contact) => contact.id === editingId) || null,
        [contacts, editingId]
    );

    const loadContacts = () => {
        setLoading(true);
        apiFetch(`/api/customers/${customerId}/contacts`)
            .then((response) => response.json())
            .then((payload) => setContacts(payload.data || []))
            .catch(() => setError('Failed to load contacts'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadContacts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    useEffect(() => {
        if (editingContact) {
            setValue({
                first_name: editingContact.first_name || '',
                last_name: editingContact.last_name || '',
                email: editingContact.email || '',
                phone: editingContact.phone || '',
                job_title: editingContact.job_title || '',
                is_primary: Boolean(editingContact.is_primary),
                notes: editingContact.notes || '',
            });
            setMode('edit');
        }
    }, [editingContact]);

    const resetForm = () => {
        setValue(emptyContact);
        setMode('create');
        setEditingId(null);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const isEdit = mode === 'edit' && editingId;
            const response = await apiFetch(
                isEdit ? `/api/contacts/${editingId}` : `/api/customers/${customerId}/contacts`,
                {
                    method: isEdit ? 'PUT' : 'POST',
                    body: JSON.stringify(value),
                }
            );

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to save contact');
            }

            loadContacts();
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (contact) => {
        setEditingId(contact.id);
        setMode('edit');
        setValue({
            first_name: contact.first_name || '',
            last_name: contact.last_name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            job_title: contact.job_title || '',
            is_primary: Boolean(contact.is_primary),
            notes: contact.notes || '',
        });
    };

    const handleDelete = async (contact) => {
        if (!window.confirm(`Delete ${contact.name}?`)) {
            return;
        }

        const response = await apiFetch(`/api/contacts/${contact.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            setError(payload.message || 'Failed to delete contact');
            return;
        }

        loadContacts();
        if (editingId === contact.id) {
            resetForm();
        }
    };

    return (
        <section className="mt-8 rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface)] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Contacts</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">Customer Contacts</h2>
                </div>
                <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                    Add New Contact
                </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface-muted)] p-5">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                        {mode === 'edit' ? 'Edit Contact' : 'Create Contact'}
                    </p>
                    <ContactForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={saving ? 'Saving...' : mode === 'edit' ? 'Update Contact' : 'Save Contact'}
                        loading={saving}
                        error={error}
                        mode={mode}
                        onCancel={resetForm}
                    />
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface-muted)] p-5 text-sm text-slate-600">Loading contacts...</div>
                    ) : contacts.length ? (
                        contacts.map((contact) => (
                            <article key={contact.id} className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-950">{contact.name}</h3>
                                            {contact.is_primary ? (
                                                <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                                                    Primary
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-600">{contact.job_title || 'Job title not set'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(contact)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(contact)}
                                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                    <p><span className="font-semibold text-slate-800">Email:</span> {contact.email || '-'}</p>
                                    <p><span className="font-semibold text-slate-800">Phone:</span> {contact.phone || '-'}</p>
                                </div>

                                {contact.notes ? (
                                    <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                                        {contact.notes}
                                    </p>
                                ) : null}
                            </article>
                        ))
                    ) : (
                        <div className="rounded-[var(--crm-radius-2xl)] border border-dashed border-slate-300 bg-[var(--crm-surface-muted)] p-5 text-sm text-slate-600">
                            No contacts added yet.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
