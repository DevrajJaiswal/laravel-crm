import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

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

    const handleRename = async (role) => {
        const nextName = window.prompt('Rename role', role.name);
        if (!nextName || nextName === role.name) return;

        const response = await apiFetch(`/api/access-control/roles/${role.id}`, {
            method: 'PUT',
            body: JSON.stringify({ name: nextName }),
        });

        if (response.ok) {
            await loadRoles();
        }
    };

    const handleDelete = async (role) => {
        if (!window.confirm(`Delete role "${role.name}"?`)) return;

        const response = await apiFetch(`/api/access-control/roles/${role.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await loadRoles();
        }
    };

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Access Control"
                    title="Roles Management"
                    description="Create roles and assign permissions."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Roles' }]}
                    actions={<Button to="/dashboard" variant="secondary">Back to Dashboard</Button>}
                />

                <Card className="mb-6">
                    <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-[1fr_auto]">
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter role name"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-500/20"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Create Role'}
                        </button>
                    </form>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                </Card>

                {loading ? (
                    <LoadingState label="Loading roles..." />
                ) : (
                    <div className="grid gap-4">
                        {roles.map((role) => (
                            <Card key={role.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">{role.name}</h2>
                                    <p className="mt-1 text-sm text-slate-600">{role.permission_count} permissions</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {role.permissions?.map((permission) => (
                                            <span key={permission} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                {permission}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRename(role)}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                                    >
                                        Edit
                                    </button>
                                    <Link
                                        to={`/access-control/roles/${role.id}/permissions`}
                                        className="rounded-xl border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Permissions
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(role)}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </ModuleLayout>
    );
}
