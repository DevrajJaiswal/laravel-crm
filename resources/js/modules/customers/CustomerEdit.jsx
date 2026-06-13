import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';
import CustomerForm from './CustomerForm';

export default function CustomerEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        apiFetch(`/api/customers/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setValue({
                    name: data.name || '',
                    company_name: data.company_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    status: data.status || 'Active',
                    industry: data.industry || '',
                    billing_address: data.billing_address || '',
                    shipping_address: data.shipping_address || '',
                    notes: data.notes || '',
                });
            })
            .catch(() => setError('Failed to load customer'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch(`/api/customers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to update customer');
            }

            const payload = await response.json();
            navigate(`/customers/${payload.customer.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !value) {
        return <main className="p-6">Loading customer...</main>;
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Customer Management</p>
                    <h1 className="mt-3 text-3xl font-black text-slate-950">Edit Customer</h1>
                </div>

                <CustomerForm
                    value={value}
                    onChange={setValue}
                    onSubmit={handleSubmit}
                    submitLabel={saving ? 'Saving...' : 'Save Changes'}
                    loading={saving}
                    error={error}
                />
            </div>
        </main>
    );
}
