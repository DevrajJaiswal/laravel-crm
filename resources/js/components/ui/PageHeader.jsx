import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import NotificationBell from '../../modules/notifications/NotificationBell';
import UserProfileMenu from './UserProfileMenu';

function Breadcrumbs({ items = [] }) {
    if (!items.length) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
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

    return (
        <Card className={`relative z-30 mb-4 p-3 sm:p-4 ${className}`}>
            <Breadcrumbs items={breadcrumbs} />
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-[1.75rem]">
                        {title}
                    </h1>
                    {description ? (
                        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
                            {description}
                        </p>
                    ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                    <NotificationBell />
                    <UserProfileMenu />
                </div>
            </div>
        </Card>
    );
}
