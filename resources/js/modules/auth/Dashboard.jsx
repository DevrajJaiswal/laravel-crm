import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { dashboardLinks } from '../navigation';
import NotificationBell from '../notifications/NotificationBell';
import {
    Button,
    Card,
    LoadingState,
    ModuleLayout,
    PageHeader,
} from '../../components/ui';

export default function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        apiFetch('/api/user')
        .then((r) => {
            if (!r.ok) {
                throw new Error(`Failed to load user (${r.status})`);
            }
            return r.json();
        })
        .then(setUser)
        .catch(() => window.location.href = '/login');
    }, []);

    if (!user) {
        return (
            <ModuleLayout>
                <div className="mx-auto w-full max-w-none">
                    <LoadingState label="Loading dashboard..." />
                </div>
            </ModuleLayout>
        );
    }

    const canAccess = (permission) =>
        user.roles?.includes('super-admin') || user.permissions?.includes(permission);

    const links = dashboardLinks.filter((link) => !link.permission || canAccess(link.permission));

    return (
        <ModuleLayout>
            <div className="w-full max-w-none">
                <PageHeader
                    eyebrow="CRM Dashboard"
                    title={`Welcome back, ${user.name}`}
                    description={user.email}
                    actions={<NotificationBell />}
                />

                <Card className="mb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quick Actions</p>
                            <p className="mt-2 text-sm text-slate-600">Jump into the main CRM areas or end the session.</p>
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => {
                                apiFetch('/api/logout', { method: 'POST' });
                                localStorage.removeItem('auth_token');
                                window.location.href = '/login';
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {links.map((link) => (
                        <Card key={link.href} className="hover:-translate-y-0.5 transition">
                            <h2 className="text-base font-bold text-slate-950">{link.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
                            <div className="mt-4">
                                <Button to={link.href} variant="dark" size="sm">
                                    Open
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </ModuleLayout>
    );
}
