import { Button, FormField, Input } from '../../components/ui';

export default function UserForm({
    value,
    onChange,
    onSubmit,
    submitLabel,
    loading,
    error,
    roles = [],
    mode = 'create',
}) {
    const toggleRole = (roleId) => {
        const next = value.roles.includes(roleId)
            ? value.roles.filter((id) => id !== roleId)
            : [...value.roles, roleId];
        onChange({ ...value, roles: next });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Name">
                <Input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} required />
            </FormField>

            <FormField label="Email">
                <Input type="email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} required />
            </FormField>

            <FormField label={mode === 'create' ? 'Password' : 'New Password'}>
                <Input
                    type="password"
                    value={value.password}
                    onChange={(e) => onChange({ ...value, password: e.target.value })}
                    required={mode === 'create'}
                />
            </FormField>

            <FormField label="Confirm Password">
                <Input
                    type="password"
                    value={value.password_confirmation}
                    onChange={(e) => onChange({ ...value, password_confirmation: e.target.value })}
                    required={mode === 'create'}
                />
            </FormField>

            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Roles</p>
                <div className="grid gap-3 md:grid-cols-2">
                    {roles.map((role) => (
                        <label key={role.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                            <input
                                type="checkbox"
                                checked={value.roles.includes(role.id)}
                                onChange={() => toggleRole(role.id)}
                                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                            />
                            <span className="text-sm font-medium text-slate-700">{role.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <Button type="submit" className="w-full" disabled={loading}>
                {submitLabel}
            </Button>
        </form>
    );
}
