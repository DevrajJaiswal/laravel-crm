import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import NotificationBell from '../../modules/notifications/NotificationBell';
import UserProfileMenu from './UserProfileMenu';

function Breadcrumbs({ items = [] }) {
    if (!items.length) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${item.href || index}`} className="flex items-center gap-2">
                        {item.href && !isLast ? (
                            <Link to={item.href} className="hover:text-slate-900">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-slate-900' : ''}>{item.label}</span>
                        )}
                        {!isLast ? <span className="text-slate-300">/</span> : null}
                    </span>
                );
            })}
        </nav>
    );
}

export default function PageHeader({
    eyebrow,
    title,
    description,
    breadcrumbs = [],
    actions = null,
    className = '',
}) {
    useEffect(() => {
        document.title = title ? `${title} | Laravel CRM` : 'Laravel CRM';
    }, [title]);

    const backHref = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2]?.href || null : null;
    const autoBack = backHref ? <Button to={backHref} variant="secondary">Back</Button> : null;
    const actionGroup = actions && typeof actions === 'object' && !('type' in actions)
        ? [actions.back || autoBack, actions.primary].filter(Boolean)
        : [autoBack, actions].filter(Boolean);

    return (
        <Card className={`relative z-30 mb-4 p-3 sm:p-4 ${className}`}>
            <div className="flex items-center justify-between gap-3">
                <Link to="/dashboard" className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black tracking-[0.2em] text-white shadow-sm">
                        LC
                    </span>
                    <span className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-[0.32em] text-slate-950">Laravel CRM</span>
                        <span className="text-xs font-medium text-slate-500">Customer relationship management</span>
                    </span>
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                    <NotificationBell />
                    <UserProfileMenu />
                </div>
            </div>
            {breadcrumbs.length ? (
                <div className="mt-3 border-t border-slate-100 pt-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <Breadcrumbs items={breadcrumbs} />
                        {actionGroup.length ? <div className="flex flex-wrap gap-3">{actionGroup}</div> : null}
                    </div>
                </div>
            ) : actions ? (
                <div className="mt-3 border-t border-slate-100 pt-3">
                    <div className="flex justify-end">
                        <div className="flex flex-wrap gap-3">{actionGroup}</div>
                    </div>
                </div>
            ) : null}
        </Card>
    );
}
