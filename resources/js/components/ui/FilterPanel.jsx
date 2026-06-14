import Card from './Card';

export default function FilterPanel({ children, className = '' }) {
    return (
        <Card className={`mb-6 p-4 ${className}`}>
            <div className="flex flex-wrap gap-3">{children}</div>
        </Card>
    );
}
