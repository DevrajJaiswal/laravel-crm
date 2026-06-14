import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';

export default function RolePermissionsPage() {
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const groupedPermissions = useMemo(() => {
        return permissions.reduce((groups, permission) => {
            const key = permission.name.split('.')[0];
            groups[key] = groups[key] || [];
            groups[key].push(permission);
            return groups;
        }, {});
    }, [permissions]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [roleResponse, permissionResponse] = await Promise.all([
                    apiFetch(`/api/access-control/roles/${id}`),
                    apiFetch('/api/access-control/permissions'),
                ]);

                const roleData = await roleResponse.json();
                const permissionData = await permissionResponse.json();

                setRole(roleData.role);
                setPermissions(permissionData.permissions || []);
                setSelected(roleData.selected_permission_ids || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const togglePermission = (permissionId) => {
        setSelected((current) =>
            current.includes(permissionId)
                ? current.filter((item) => item !== permissionId)
                : [...current, permissionId],
        );
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch(`/api/access-control/roles/${id}/permissions`, {
                method: 'PUT',
                body: JSON.stringify({ permissions: selected }),
            });

            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ModuleLayout className="flex items-center justify-center">
                <LoadingState label="Loading permissions..." />
            </ModuleLayout>
        );
    }

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Access Control"
                    title={`Permission Assignment: ${role?.name}`}
                    description="Choose which permissions belong to this role."
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Roles', href: '/access-control/roles' },
                        { label: 'Permissions' },
                    ]}
                    actions={<Button to="/access-control/roles" variant="secondary">Back to Roles</Button>}
                />

                {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

                <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([group, items]) => (
                        <Card key={group}>
                            <h2 className="mb-4 text-lg font-bold capitalize text-slate-950">{group}</h2>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((permission) => (
                                    <label key={permission.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(permission.id)}
                                            onChange={() => togglePermission(permission.id)}
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                        />
                                        <span className="text-sm font-medium text-slate-700">{permission.name}</span>
                                    </label>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Permissions'}
                    </button>
                    <span className="text-sm text-slate-600">{selected.length} selected</span>
                </div>
            </div>
        </ModuleLayout>
    );
}
