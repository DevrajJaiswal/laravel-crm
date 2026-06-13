import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';
import LeadForm from './LeadForm';
import { leadSources, leadStatuses } from './leadOptions';

export default function LeadEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
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
        return <main className="p-6">Loading lead...</main>;
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <h1 className="mb-6 text-3xl font-black text-slate-950">Edit Lead</h1>
                <LeadForm
                    value={value}
                    onChange={setValue}
                    onSubmit={handleSubmit}
                    submitLabel={saving ? 'Saving...' : 'Save Lead'}
                    loading={saving}
                    error={error}
                />
                <button
                    type="button"
                    onClick={() => navigate('/leads')}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700"
                >
                    Cancel
                </button>
            </div>
        </main>
    );
}
