import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import {
    Alert,
    Button,
    Card,
    FormField,
    Input,
    ModuleLayout,
} from '../../components/ui';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Then login
            const response = await apiFetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || `Login failed (${response.status})`);
                return;
            }

            localStorage.setItem('auth_token', data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModuleLayout className="flex items-center justify-center">
            <Card className="w-full max-w-md p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Authentication</p>
                <h1 className="mt-3 text-3xl font-black text-slate-950">Login</h1>

                {error ? (
                    <Alert tone="danger" className="mt-6">
                        {error}
                    </Alert>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="font-semibold text-slate-900 hover:underline">
                        Register
                    </a>
                </p>
            </Card>
        </ModuleLayout>
    );
}
