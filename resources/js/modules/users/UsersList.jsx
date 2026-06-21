import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, DataTable, EmptyState, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const [usersResponse, meResponse] = await Promise.all([
            apiFetch('/api/users'),
            apiFetch('/api/user'),
        ]);

        const usersData = await usersResponse.json();
        const meData = await meResponse.json();

        setUsers(usersData);
        setCurrentUser(meData);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers().catch(() => {
            alert('Failed to load users. Please login first.');
            setLoading(false);
        });
    }, []);

    const isSuperAdmin = currentUser?.roles?.includes('super-admin');
    const canCreate = isSuperAdmin || currentUser?.permissions?.includes('users.create');
    const canUpdate = isSuperAdmin || currentUser?.permissions?.includes('users.update');
    const canDelete = isSuperAdmin || currentUser?.permissions?.includes('users.delete');

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
                    {canUpdate ? (
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/users/${user.id}/edit`)}>
                            Edit
                        </Button>
                    ) : null}
                    {canDelete ? (
                        <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)} disabled={deleting}>
                            Delete
                        </Button>
                    ) : null}
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
                    actions={
                        <>
                            {canCreate ? <Button to="/users/create">Create User</Button> : null}
                            <Button to="/dashboard" variant="secondary">Back to Dashboard</Button>
                        </>
                    }
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
