import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiFetch } from '../../shared/apiClient';
import CustomerForm from './CustomerForm';

export default function CustomerCreate() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        name: '',
        company_name: '',
        email: '',
        phone: '',
        status: 'Active',
        industry: '',
        billing_address: '',
        shipping_address: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiFetch('/api/customers', {
                method: 'POST',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create customer');
            }

            const payload = await response.json();
            navigate(`/customers/${payload.customer.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <h1 className="mb-6 text-3xl font-black text-slate-950">Create Customer</h1>
                <CustomerForm
                    value={value}
                    onChange={setValue}
                    onSubmit={handleSubmit}
                    submitLabel={loading ? 'Creating...' : 'Create Customer'}
                    loading={loading}
                    error={error}
                />
            </div>
        </main>
    );
}
