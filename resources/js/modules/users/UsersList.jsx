import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, DataTable, EmptyState, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

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

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (user) => (
                <div>
                    <div className="font-semibold text-slate-950">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            cellClassName: 'w-48',
            render: (user) => (
                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/users/${user.id}/edit`)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)} disabled={deleting}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Users Management"
                    title="Users"
                    description="Create, edit, and remove CRM users."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users' }]}
                    actions={<Button to="/dashboard" variant="secondary">Back to Dashboard</Button>}
                />

                {loading ? (
                    <LoadingState label="Loading users..." />
                ) : users.data && users.data.length > 0 ? (
                    <DataTable columns={columns} data={users.data} />
                ) : (
                    <EmptyState
                        title="No users found"
                        description="Login required or no records have been created yet."
                        actionLabel="Go to Login"
                        actionTo="/login"
                    />
                )}
            </div>
        </ModuleLayout>
    );
}
