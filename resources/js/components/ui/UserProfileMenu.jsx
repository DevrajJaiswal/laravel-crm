import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import Button from './Button';
import Modal from './Modal';

function getInitials(name = '') {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'U';
}

export default function UserProfileMenu() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        apiFetch('/api/user')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load profile');
                }
                return response.json();
            })
            .then(setUser)
            .catch(() => setUser(null));
    }, []);

    const initials = getInitials(user?.name);

    const handleLogout = async () => {
        await apiFetch('/api/logout', { method: 'POST' });
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-1 py-1 text-left text-lg font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
                {user?.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={user.name || 'User avatar'}
                        className="h-9 w-9 rounded-xl object-cover"
                    />
                ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                        {initials}
                    </span>
                )}
            </button>

            <Modal open={open} title="Profile" onClose={() => setOpen(false)}>
                <div className="space-y-5">
                    <div className="flex items-center gap-4">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.name || 'User avatar'}
                                className="h-16 w-16 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                                {initials}
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-slate-950">{user?.name || 'Loading...'}</h3>
                            <p className="text-sm text-slate-600">{user?.email || 'Loading profile details...'}</p>
                        </div>
                    </div>

                    {user ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                            <p className="font-semibold text-slate-900">Roles</p>
                            <p className="mt-1">{user.roles?.length ? user.roles.join(', ') : 'No roles assigned'}</p>
                        </div>
                    ) : null}

                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
