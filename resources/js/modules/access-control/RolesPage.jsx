import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, Input, LoadingState, Modal, ModuleLayout, PageHeader } from '../../components/ui';

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editRole, setEditRole] = useState(null);
    const [deleteRole, setDeleteRole] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    const isReservedRole = (role) => role?.is_reserved || ['administrator', 'super-admin'].includes(role?.name?.toLowerCase());

    const summaryText = (role) => {
        if (isReservedRole(role)) {
            return 'Full access to all current and future modules.';
        }

        const moduleCount = role.permission_summary?.length || 0;
        return `${role.permission_count} permissions across ${moduleCount} modules.`;
    };

    const loadRoles = async () => {
        setLoading(true);
        try {
            const response = await apiFetch('/api/access-control/roles');

            if (!response.ok) {
                throw new Error(`Failed to load roles (${response.status})`);
            }

            const data = await response.json();
            setRoles(data.roles || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleCreate = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch('/api/access-control/roles', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create role');
            }

            setName('');
            await loadRoles();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const openRename = (role) => {
        setEditRole(role);
        setRenameValue(role.name);
    };

    const handleRename = async () => {
        if (!editRole || !renameValue || renameValue === editRole.name) return;
        if (isReservedRole(editRole)) return;
        try {
            const response = await apiFetch(`/api/access-control/roles/${editRole.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: renameValue }),
            });

            if (response.ok) {
                setEditRole(null);
                setRenameValue('');
                await loadRoles();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!deleteRole) return;
        if (isReservedRole(deleteRole)) return;
        const response = await apiFetch(`/api/access-control/roles/${deleteRole.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setDeleteRole(null);
            await loadRoles();
        }
    };

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Access Control"
                    title="Roles Management"
                    description="Create custom roles and keep the built-in Administrator role reserved."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Roles' }]}

                />

                <Card className="mb-6">
                    <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter role name"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Create Role'}
                        </button>
                    </form>
                    <p className="mt-3 text-xs text-slate-600">
                        <span className="font-semibold text-slate-900">Role type:</span> Custom roles are editable. Administrator is reserved.
                    </p>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                </Card>

                {loading ? (
                    <LoadingState label="Loading roles..." />
                ) : (
                    <div className="grid gap-4">
                        {roles.map((role) => (
                            <Card key={role.id} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-950">{role.name}</h2>
                                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                                            {role.role_type}
                                        </span>
                                        {isReservedRole(role) ? (
                                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                                                Locked
                                            </span>
                                        ) : null}
                                    </div>

                                    <p className="text-sm text-slate-600">{summaryText(role)}</p>

                                    {isReservedRole(role) ? null : (
                                        <div className="flex flex-wrap gap-2">
                                            {(role.permission_summary || []).slice(0, 4).map((group) => (
                                                <span
                                                    key={`${role.id}-${group.module}`}
                                                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                                                >
                                                    {group.module}: {group.actions}
                                                </span>
                                            ))}
                                            {(role.permission_summary || []).length > 4 ? (
                                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                                    +{role.permission_summary.length - 4} more modules
                                                </span>
                                            ) : null}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {!isReservedRole(role) ? (
                                        <>
                                            <button type="button" onClick={() => openRename(role)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                                Edit
                                            </button>
                                            <Link
                                                to={`/access-control/roles/${role.id}/permissions`}
                                                className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                            >
                                                Permissions
                                            </Link>
                                            <button type="button" onClick={() => setDeleteRole(role)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to={`/access-control/roles/${role.id}/permissions`}
                                            className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                        >
                                            View Permissions
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Modal open={Boolean(editRole)} title="Rename Role" onClose={() => setEditRole(null)}>
                    <div className="space-y-4">
                        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setEditRole(null)}>Cancel</Button>
                            <Button onClick={handleRename}>Save</Button>
                        </div>
                    </div>
                </Modal>

                <Modal open={Boolean(deleteRole)} title="Delete Role" onClose={() => setDeleteRole(null)}>
                    <div className="space-y-4">
                        <p className="text-sm leading-6 text-slate-600">
                            Delete role <span className="font-semibold text-slate-900">{deleteRole?.name}</span>? This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeleteRole(null)}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </ModuleLayout>
    );
}
