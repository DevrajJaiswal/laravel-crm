import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Button, Modal } from '../../components/ui';
import ActivityForm from './ActivityForm';

const emptyActivity = {
    type: 'Call',
    subject: '',
    occurred_at: '',
    notes: '',
};

const typeLabels = {
    Call: 'Call',
    Meeting: 'Meeting',
    Email: 'Email',
};

export default function CustomerActivitiesSection({ customerId }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('create');
    const [editingId, setEditingId] = useState(null);
    const [value, setValue] = useState(emptyActivity);
    const [deleteActivity, setDeleteActivity] = useState(null);

    const editingActivity = useMemo(
        () => activities.find((activity) => activity.id === editingId) || null,
        [activities, editingId]
    );

    const loadActivities = () => {
        setLoading(true);
        apiFetch(`/api/customers/${customerId}/activities`)
            .then((response) => response.json())
            .then((payload) => setActivities(payload.data || []))
            .catch(() => setError('Failed to load activities'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadActivities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);

    useEffect(() => {
        if (editingActivity) {
            setValue({
                type: editingActivity.type || 'Call',
                subject: editingActivity.subject || '',
                occurred_at: editingActivity.occurred_at ? editingActivity.occurred_at.slice(0, 16) : '',
                notes: editingActivity.notes || '',
            });
            setMode('edit');
        }
    }, [editingActivity]);

    const resetForm = () => {
        setValue(emptyActivity);
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
                isEdit ? `/api/activities/${editingId}` : `/api/customers/${customerId}/activities`,
                {
                    method: isEdit ? 'PUT' : 'POST',
                    body: JSON.stringify(value),
                }
            );

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to save activity');
            }

            loadActivities();
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (activity) => {
        setEditingId(activity.id);
        setMode('edit');
        setValue({
            type: activity.type || 'Call',
            subject: activity.subject || '',
            occurred_at: activity.occurred_at ? activity.occurred_at.slice(0, 16) : '',
            notes: activity.notes || '',
        });
    };

    const handleDelete = async () => {
        if (!deleteActivity) return;

        const response = await apiFetch(`/api/activities/${deleteActivity.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            setError(payload.message || 'Failed to delete activity');
            return;
        }

        loadActivities();
        if (editingId === deleteActivity.id) {
            resetForm();
        }
        setDeleteActivity(null);
    };

    return (
        <section className="mt-8 rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface)] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Activities</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">Customer Timeline</h2>
                </div>
                <Button type="button" variant="secondary" onClick={resetForm}>
                    Create
                </Button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface-muted)] p-5">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                        {mode === 'edit' ? 'Edit Activity' : 'Create Activity'}
                    </p>
                    <ActivityForm
                        value={value}
                        onChange={setValue}
                        onSubmit={handleSubmit}
                        submitLabel={saving ? 'Saving...' : mode === 'edit' ? 'Save' : 'Create'}
                        loading={saving}
                        error={error}
                        mode={mode}
                        onCancel={resetForm}
                    />
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-[var(--crm-surface-muted)] p-5 text-sm text-slate-600">Loading activities...</div>
                    ) : activities.length ? (
                        activities.map((activity) => (
                            <article key={activity.id} className="rounded-[var(--crm-radius-2xl)] border border-[var(--crm-border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                                                {typeLabels[activity.type] || activity.type}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-950">{activity.subject}</h3>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {activity.occurred_at ? new Date(activity.occurred_at).toLocaleString() : 'No date set'}
                                            {activity.user?.name ? ` · ${activity.user.name}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="secondary" size="sm" onClick={() => handleEdit(activity)}>
                                            Edit
                                        </Button>
                                        <Button type="button" variant="danger" size="sm" onClick={() => setDeleteActivity(activity)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {activity.notes ? (
                                    <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                                        {activity.notes}
                                    </p>
                                ) : null}
                            </article>
                        ))
                    ) : (
                        <div className="rounded-[var(--crm-radius-2xl)] border border-dashed border-slate-300 bg-[var(--crm-surface-muted)] p-5 text-sm text-slate-600">
                            No activities recorded yet.
                        </div>
                    )}
                </div>
            </div>

            <Modal open={Boolean(deleteActivity)} title="Delete Activity" onClose={() => setDeleteActivity(null)}>
                <div className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                        Delete <span className="font-semibold text-slate-900">{deleteActivity?.subject}</span>? This cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteActivity(null)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
