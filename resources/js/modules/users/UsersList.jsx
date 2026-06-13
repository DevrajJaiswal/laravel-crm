import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = () => {
        apiFetch('/api/users')
        .then(r => {
            if (!r.ok) {
                throw new Error(`Failed to load users (${r.status})`);
            }
            return r.json();
        })
        .then(data => {
            setUsers(data);
        })
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Failed to load users. Please login first.');
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        setDeleting(true);
        
        try {
            const response = await apiFetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchUsers();
            } else {
                const data = await response.json().catch(() => ({}));
                alert('Delete failed: ' + (data.message || response.status));
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Network error');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)]">
                <div className="text-slate-600">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] text-slate-900 p-6">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl font-bold text-slate-950">Users Management</h1>
                
                <div className="space-y-3">
                    {users.data && users.data.length > 0 ? (
                        users.data.map(user => (
                            <div key={user.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4 flex justify-between items-center backdrop-blur transition-shadow hover:shadow-md">
                                <div>
                                    <span className="font-medium text-slate-900">{user.name}</span>
                                    <span className="ml-2 text-slate-500">{user.email}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => navigate(`/users/${user.id}/edit`)}
                                        className="rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleDelete(user.id)}
                                        disabled={deleting}
                                        className="rounded-xl bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center">
                            <p className="text-slate-600">No users found. Login required.</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="mt-4 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
