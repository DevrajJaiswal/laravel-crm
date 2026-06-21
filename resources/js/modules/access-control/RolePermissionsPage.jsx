import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';
import { permissionActionLabel, permissionActionOrder, permissionGroupLabel } from '../auth/access';

function PermissionGroupCard({ group, items, selected, onTogglePermission, onToggleGroup }) {
    const selectAllRef = useRef(null);
    const actionPermissions = items.filter((permission) => !(permission.name.startsWith('manage-') && !permission.name.includes('.')));
    const allSelected = items.every((permission) => selected.includes(permission.id));
    const someSelected = !allSelected && items.some((permission) => selected.includes(permission.id));

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    return (
        <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold capitalize text-slate-950">{group}</h2>
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => onToggleGroup(items)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <span>Select all</span>
                </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {actionPermissions.map((permission) => (
                    <label key={permission.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={selected.includes(permission.id)}
                            onChange={() => onTogglePermission(permission.id)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{permissionActionLabel(permission.name)}</span>
                    </label>
                ))}
            </div>
        </Card>
    );
}

function normalizePermissionList(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && typeof value === 'object') {
        return Object.values(value);
    }

    return [];
}

export default function RolePermissionsPage() {
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const reservedRole = role?.is_reserved;

    const groupedPermissions = useMemo(() => {
        return permissions.reduce((groups, permission) => {
            const key = permissionGroupLabel(permission.name);
            groups[key] = groups[key] || [];
            groups[key].push(permission);
            return groups;
        }, {});
    }, [permissions]);

    const orderedGroups = useMemo(() => {
        const groupOrder = {
            Settings: 0,
            Roles: 1,
            Users: 2,
            'Access Control': 3,
        };

        return Object.entries(groupedPermissions)
            .map(([group, items]) => [
                group,
                [...items].sort((a, b) => {
                    const actionDiff = permissionActionOrder(a.name) - permissionActionOrder(b.name);
                    return actionDiff !== 0 ? actionDiff : a.name.localeCompare(b.name);
                }),
            ])
            .sort(([groupA], [groupB]) => (groupOrder[groupA] ?? 99) - (groupOrder[groupB] ?? 99) || groupA.localeCompare(groupB));
    }, [groupedPermissions]);

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
                setPermissions(normalizePermissionList(permissionData.permissions));
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

    const toggleGroup = (items) => {
        setSelected((current) => {
            const ids = items.map((permission) => permission.id);
            const allSelected = ids.every((id) => current.includes(id));

            if (allSelected) {
                return current.filter((id) => !ids.includes(id));
            }

            return Array.from(new Set([...current, ...ids]));
        });
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
                    description={
                        reservedRole
                            ? 'Administrator is reserved and always has full access.'
                            : 'Choose which permissions belong to this role.'
                    }
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Roles', href: '/access-control/roles' },
                        { label: 'Permissions' },
                    ]}

                />

                {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

                {reservedRole ? (
                    <Card>
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Reserved role</p>
                            <h2 className="text-xl font-bold text-slate-950">Administrator</h2>
                            <p className="text-sm leading-6 text-slate-600">
                                This role is locked. It automatically receives access to all current and future CRM modules.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="space-y-6">
                            {orderedGroups.map(([group, items]) => (
                                <PermissionGroupCard
                                    key={group}
                                    group={group}
                                    items={items}
                                    selected={selected}
                                    onTogglePermission={togglePermission}
                                    onToggleGroup={toggleGroup}
                                />
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
                    </>
                )}
            </div>
        </ModuleLayout>
    );
}
