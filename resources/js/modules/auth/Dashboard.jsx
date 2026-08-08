import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import { dashboardLinks } from '../navigation';
import { canAccess } from './access';
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

    const links = dashboardLinks.filter((link) => !link.permission || canAccess(user, link.permission));

    return (
        <ModuleLayout>
            <div className="w-full max-w-none">
                <PageHeader
                />

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
