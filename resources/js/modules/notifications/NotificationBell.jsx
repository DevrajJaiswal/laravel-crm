import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch } from '../../lib/apiClient';
import { Button } from '../../components/ui';

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const [menuStyle, setMenuStyle] = useState(null);

    const loadNotifications = () => {
        apiFetch('/api/notifications')
            .then((response) => response.json())
            .then((payload) => {
                setNotifications(payload.data || []);
                setUnreadCount(payload.unread_count || 0);
            });
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        if (!open || !triggerRef.current) {
            return undefined;
        }

        const updatePosition = () => {
            const rect = triggerRef.current.getBoundingClientRect();
            setMenuStyle({
                top: rect.bottom + 12,
                right: Math.max(16, window.innerWidth - rect.right),
            });
        };

        updatePosition();

        const handleClickOutside = (event) => {
            const clickedTrigger = triggerRef.current?.contains(event.target);
            const clickedMenu = menuRef.current?.contains(event.target);

            if (!clickedTrigger && !clickedMenu) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open]);

    const markRead = async (id) => {
        await apiFetch(`/api/notifications/${id}/read`, {
            method: 'POST',
        });
        loadNotifications();
    };

    const markAllRead = async () => {
        await apiFetch('/api/notifications/read-all', {
            method: 'POST',
        });
        loadNotifications();
    };

    return (
        <div className="relative z-[60]">
            <Button
                ref={triggerRef}
                type="button"
                variant="secondary"
                onClick={() => setOpen((value) => !value)}
                className="relative"
                aria-expanded={open}
                aria-haspopup="menu"
            >
                Notifications
                {unreadCount > 0 ? (
                    <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-slate-950 px-2 py-0.5 text-[11px] font-bold text-white">
                        {unreadCount}
                    </span>
                ) : null}
            </Button>

            {open && menuStyle ? createPortal(
                <div
                    ref={menuRef}
                    className="fixed z-[9999] w-[22rem] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.18)]"
                    style={menuStyle}
                    role="menu"
                >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                        <Button type="button" variant="ghost" size="sm" onClick={markAllRead} className="px-2 py-1 text-xs">
                            Mark all read
                        </Button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length ? (
                            notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`border-b border-slate-100 p-4 last:border-b-0 ${notification.read_at ? 'bg-white' : 'bg-slate-50'}`}
                            >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                                            <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
                                            <p className="mt-2 text-xs text-slate-400">{notification.created_at}</p>
                                        </div>
                                        {!notification.read_at ? (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => markRead(notification.id)}
                                                className="px-2.5 py-1 text-[11px] uppercase tracking-wider"
                                            >
                                                Read
                                            </Button>
                                        ) : null}
                                    </div>

                                    {notification.link ? (
                                        <a
                                            href={notification.link}
                                            className="mt-3 inline-flex text-sm font-semibold text-slate-700"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                markRead(notification.id).finally(() => {
                                                    window.location.href = notification.link;
                                                });
                                            }}
                                        >
                                            Open
                                        </a>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-slate-500">No notifications yet.</div>
                        )}
                    </div>
                </div>,
                document.body,
            ) : null}
        </div>
    );
}
