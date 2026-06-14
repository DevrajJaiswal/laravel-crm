import Card from './Card';
import EmptyState from './EmptyState';

function renderCell(column, row) {
    if (typeof column.render === 'function') {
        return column.render(row);
    }

    return row[column.key];
}

export default function DataTable({ columns, data = [], emptyTitle = 'Nothing to show yet.', emptyDescription, className = '' }) {
    if (!data.length) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                className={className}
            />
        );
    }

    return (
        <Card className={`overflow-hidden p-0 ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 ${column.headerClassName || ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.map((row, index) => (
                            <tr key={row.id ?? index} className="hover:bg-slate-50/70">
                                {columns.map((column) => (
                                    <td key={column.key} className={`px-5 py-4 text-sm text-slate-700 ${column.cellClassName || ''}`}>
                                        {renderCell(column, row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
