import { Navigate } from 'react-router-dom';
import DataTransferPage from './DataTransferPage';
import DataTransferHome from './DataTransferHome';
import ImportPage from './ImportPage';
import ExportPage from './ExportPage';
import DataTransferHistoryPage from './DataTransferHistoryPage';
import DataTransferHistoryList from './DataTransferHistoryList';

export const routes = [
    {
        path: 'data-transfer',
        element: <DataTransferPage />,
        children: [
            { index: true, element: <DataTransferHome /> },
            { path: 'import', element: <ImportPage /> },
            { path: 'export', element: <ExportPage /> },
            {
                path: 'history',
                element: <DataTransferHistoryPage /> ,
                children: [
                    { index: true, element: <DataTransferHistoryList mode="all" /> },
                    { path: 'imports', element: <DataTransferHistoryList mode="imports" /> },
                    { path: 'exports', element: <DataTransferHistoryList mode="exports" /> },
                ],
            },
        ],
    },
    { path: 'imports', element: <Navigate to="/data-transfer/import" replace /> },
    { path: 'exports', element: <Navigate to="/data-transfer/export" replace /> },
    { path: 'history', element: <Navigate to="/data-transfer/history" replace /> },
];
