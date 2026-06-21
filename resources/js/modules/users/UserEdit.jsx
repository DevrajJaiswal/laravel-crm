import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button, Card, LoadingState, ModuleLayout, PageHeader } from '../../components/ui';
import UserForm from './UserForm';

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '', roles: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([apiFetch('/api/users/meta'), apiFetch(`/api/users/${id}`)])
            .then(async ([rolesResponse, userResponse]) => {
                const rolesPayload = await rolesResponse.json();
                const userPayload = await userResponse.json();
                setRoles(rolesPayload.roles || []);
                setFormData({
                    name: userPayload.name || '',
                    email: userPayload.email || '',
                    password: '',
                    password_confirmation: '',
                    roles: userPayload.roles || [],
                });
            })
            .catch(() => navigate('/users'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const response = await apiFetch(`/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Update failed');
            }
            navigate('/users');
        } catch (err) {
            setError(err.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <ModuleLayout className="flex items-center justify-center"><LoadingState label="Loading user..." /></ModuleLayout>;
    }

    return (
        <ModuleLayout>
            <div className="w-full max-w-4xl space-y-6">
                <PageHeader
                    eyebrow="Users Management"
                    title="Edit User"
                    description="Update the selected user's profile and contact details."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users', href: '/users' }, { label: 'Edit User' }]}
                    actions={<Button to="/users" variant="secondary">Back to Users</Button>}
                />

                <Card className="p-8">
                    <UserForm value={formData} onChange={setFormData} onSubmit={handleSubmit} submitLabel={saving ? 'Saving...' : 'Save Changes'} loading={saving} error={error} roles={roles} mode="edit" />
                </Card>
            </div>
        </ModuleLayout>
    );
}
