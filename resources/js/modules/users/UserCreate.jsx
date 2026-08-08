import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';
import UserForm from './UserForm';

export default function UserCreate() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [value, setValue] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const formId = 'user-create-form';

    useEffect(() => {
        apiFetch('/api/users/meta')
            .then((response) => response.json())
            .then((payload) => setRoles(payload.roles || []))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await apiFetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Failed to create user');
            }

            navigate('/users');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <ModuleLayout className="flex items-center justify-center"><LoadingState label="Loading user form..." /></ModuleLayout>;
    }

    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users', href: '/users' }, { label: 'Create' }]}
                    actions={{
                        back: <Button to="/users" variant="secondary">Back</Button>,
                        primary: <Button type="submit" form={formId} disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>,
                    }}

                />
                <Card className="p-5 lg:p-6">
                    <UserForm formId={formId} value={value} onChange={setValue} onSubmit={handleSubmit} error={error} roles={roles} mode="create" />
                </Card>
            </div>
        </ModuleLayout>
    );
}
