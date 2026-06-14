import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { Alert, Button, Card, FormField, Input, ModuleLayout } from '../../components/ui';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiFetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed');
                return;
            }

            localStorage.setItem('auth_token', data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModuleLayout className="flex items-center justify-center">
            <Card className="w-full max-w-md p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Authentication</p>
                <h1 className="mt-3 text-3xl font-black text-slate-950">Register</h1>

                {error ? <Alert tone="danger" className="mt-6">{error}</Alert> : null}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

                    <FormField label="Password">
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </FormField>

                    <FormField label="Confirm Password">
                        <Input
                            type="password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            required
                        />
                    </FormField>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold text-slate-900 hover:underline">
                        Login
                    </a>
                </p>
            </Card>
        </ModuleLayout>
    );
}
