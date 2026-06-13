import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

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
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Access Control</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">Roles Management</h1>
                    </div>
                    <Link to="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        Back to dashboard
                    </Link>
                </div>

                <form onSubmit={handleCreate} className="mb-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter role name"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Create Role'}
                        </button>
                    </div>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                </form>

                {loading ? (
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">Loading roles...</div>
                ) : (
                    <div className="grid gap-4">
                        {roles.map((role) => (
                            <div key={role.id} className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">{role.name}</h2>
                                    <p className="mt-1 text-sm text-slate-600">{role.permission_count} permissions</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {role.permissions?.map((permission) => (
                                            <span key={permission} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
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
                                        className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Permissions
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(role)}
                                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
