import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch(`/api/users/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load user (${response.status})`);
            }
            return response.json();
        })
        .then(data => setFormData({ name: data.name, email: data.email }))
        .catch(() => navigate('/users'));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await apiFetch(`/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) throw new Error('Update failed');
            navigate('/users');
        } catch (err) {
            setError('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <h1 className="text-3xl font-bold text-slate-950 mb-6">Edit User</h1>
                
                {error && (
                    <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-amber-600 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-amber-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </form>

                <button
                    onClick={() => navigate('/users')}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
