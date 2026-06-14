import { useEffect, useState } from 'react';
import { apiFetch } from '../../shared/apiClient';
import { dashboardLinks } from '../navigation';
import NotificationBell from '../notifications/NotificationBell';

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

    if (!user) return <div className="p-6">Loading...</div>;

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] flex items-center justify-center p-6">
            <div className="w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-950 mb-4">Dashboard</h1>
                        <p className="text-slate-600 mb-2">Welcome, {user.name}!</p>
                        <p className="text-slate-600">{user.email}</p>
                    </div>
                    <NotificationBell />
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {dashboardLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-[1.5rem] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <h2 className="text-base font-semibold text-slate-950">{link.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
                        </a>
                    ))}
                </div>
                <button
                    onClick={() => {
                        apiFetch('/api/logout', { method: 'POST' });
                        localStorage.removeItem('auth_token');
                        window.location.href = '/login';
                    }}
                    className="mt-8 rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}
