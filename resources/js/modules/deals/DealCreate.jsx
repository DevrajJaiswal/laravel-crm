import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';
import DealForm from './DealForm';

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
        return <main className="p-6">Loading deal form...</main>;
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <h1 className="mb-6 text-3xl font-black text-slate-950">Create Deal</h1>
                <DealForm
                    value={value}
                    onChange={setValue}
                    onSubmit={handleSubmit}
                    submitLabel={saving ? 'Creating...' : 'Create Deal'}
                    loading={saving}
                    error={error}
                    customers={customers}
                />
            </div>
        </main>
    );
}
