import { Navigate } from 'react-router-dom';
import DataTransferPage from './DataTransferPage';
import DataTransferHome from './DataTransferHome';
import ImportPage from './ImportPage';
import ExportPage from './ExportPage';
import ImportHistory from './ImportHistory';

export const routes = [
    {
        path: 'data-transfer',
        element: <DataTransferPage />,
        children: [
            { index: true, element: <DataTransferHome /> },
            { path: 'import', element: <ImportPage /> },
            { path: 'export', element: <ExportPage /> },
            { path: 'history', element: <ImportHistory /> },
        ],
    },
    { path: 'imports', element: <Navigate to="/data-transfer/import" replace /> },
    { path: 'exports', element: <Navigate to="/data-transfer/export" replace /> },
];
