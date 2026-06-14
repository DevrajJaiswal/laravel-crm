import { Navigate } from 'react-router-dom';
import ImportExportPage from './ImportExportPage';
import DataTransferPage from './DataTransferPage';
import ImportPage from './ImportPage';
import ExportPage from './ExportPage';
import ImportHistory from './ImportHistory';

export const routes = [
    {
        path: 'data-transfer',
        element: <ImportExportPage />,
        children: [
            { index: true, element: <DataTransferPage /> },
            { path: 'import', element: <ImportPage /> },
            { path: 'export', element: <ExportPage /> },
            { path: 'history', element: <ImportHistory /> },
        ],
    },
    { path: 'imports', element: <Navigate to="/data-transfer/import" replace /> },
    { path: 'exports', element: <Navigate to="/data-transfer/export" replace /> },
];
