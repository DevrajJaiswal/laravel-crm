import Card from './Card';

export default function ContentSection({ title, description, actions = null, className = '', children }) {
    return (
        <Card className={className}>
            {(title || description || actions) ? (
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        {title ? <h2 className="text-lg font-bold text-slate-950">{title}</h2> : null}
                        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
                    </div>
                    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
                </div>
            ) : null}
            {children}
        </Card>
    );
}
