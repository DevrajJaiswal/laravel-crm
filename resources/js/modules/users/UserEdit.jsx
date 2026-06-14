import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { Alert, Button, Card, FormField, Input, ModuleLayout, PageHeader } from '../../components/ui';

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch(`/api/users/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load user (${response.status})`);
            }
            return response.json();
        })
        .then(data => setFormData({ name: data.name, email: data.email }))
        .catch(() => navigate('/users'));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await apiFetch(`/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) throw new Error('Update failed');
            navigate('/users');
        } catch (err) {
            setError('Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModuleLayout className="flex items-center justify-center">
            <div className="w-full max-w-md">
                <PageHeader
                    eyebrow="Users Management"
                    title="Edit User"
                    description="Update the selected user's profile and contact details."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users', href: '/users' }, { label: 'Edit User' }]}
                />

                <Card className="p-8">
                    {error ? <Alert tone="danger" className="mb-4">{error}</Alert> : null}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Name">
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </FormField>

                        <FormField label="Email">
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </FormField>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="secondary" className="w-full" onClick={() => navigate('/users')}>
                            Cancel
                        </Button>
                    </form>
                </Card>
            </div>
        </ModuleLayout>
    );
}
