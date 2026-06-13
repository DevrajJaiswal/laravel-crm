import { useEffect, useState } from 'react';
import { apiFetch } from '../../shared/apiClient';

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
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur">
                <h1 className="text-3xl font-bold text-slate-950 mb-4">Dashboard</h1>
                <p className="text-slate-600 mb-2">Welcome, {user.name}!</p>
                <p className="text-slate-600">{user.email}</p>
                <a
                    href="/access-control/roles"
                    className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    Open Roles & Permissions
                </a>
                <button
                    onClick={() => {
                        apiFetch('/api/logout', { method: 'POST' });
                        localStorage.removeItem('auth_token');
                        window.location.href = '/login';
                    }}
                    className="mt-4 rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}
