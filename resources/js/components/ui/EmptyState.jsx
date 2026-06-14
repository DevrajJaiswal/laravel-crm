import Button from './Button';
import Card from './Card';

export default function EmptyState({ title, description, actionLabel, actionTo, className = '' }) {
    return (
        <Card className={`text-center ${className}`}>
            <p className="text-lg font-bold text-slate-950">{title}</p>
            {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
            {actionLabel ? (
                <div className="mt-5">
                    <Button to={actionTo} variant="dark">
                        {actionLabel}
                    </Button>
                </div>
            ) : null}
        </Card>
    );
}
