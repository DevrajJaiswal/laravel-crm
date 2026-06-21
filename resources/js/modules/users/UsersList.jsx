import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, DataTable, EmptyState, LoadingState, Modal, ModuleLayout, PageHeader } from '../../components/ui';
import { isPrivilegedUser } from '../auth/access';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);
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

    const canCreate = isPrivilegedUser(currentUser) || currentUser?.permissions?.includes('users.create');
    const canUpdate = isPrivilegedUser(currentUser) || currentUser?.permissions?.includes('users.update');
    const canDelete = isPrivilegedUser(currentUser) || currentUser?.permissions?.includes('users.delete');

    const handleDelete = async () => {
        if (!deleteUser) return;
        setDeleting(true);

        try {
            const response = await apiFetch(`/api/users/${deleteUser.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDeleteUser(null);
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
                        <Button variant="danger" size="sm" onClick={() => setDeleteUser(user)} disabled={deleting}>
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

                <Modal open={Boolean(deleteUser)} title="Delete User" onClose={() => setDeleteUser(null)}>
                    <div className="space-y-4">
                        <p className="text-sm leading-6 text-slate-600">
                            Delete <span className="font-semibold text-slate-900">{deleteUser?.name}</span>? This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeleteUser(null)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </ModuleLayout>
    );
}

