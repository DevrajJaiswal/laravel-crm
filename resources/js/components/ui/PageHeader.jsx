import { Link } from 'react-router-dom';
import Card from './Card';

function Breadcrumbs({ items = [] }) {
    if (!items.length) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
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
    return (
        <Card className={`mb-6 ${className}`}>
            <Breadcrumbs items={breadcrumbs} />
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    {eyebrow ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            {eyebrow}
                        </p>
                    ) : null}
                    <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                        {title}
                    </h1>
                    {description ? (
                        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
        </Card>
    );
}
