import Button from './Button';
import Card from './Card';

export default function Pagination({ meta, onPageChange, className = '' }) {
    if (!meta) {
        return null;
    }

    const currentPage = meta.current_page || 1;
    const lastPage = meta.last_page || 1;
    const from = meta.from || 0;
    const to = meta.to || 0;
    const total = meta.total || 0;

    return (
        <Card className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
            <p className="text-sm text-slate-600">
                Showing {from} to {to} of {total}
            </p>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </Card>
    );
}
