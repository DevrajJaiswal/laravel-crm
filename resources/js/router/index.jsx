import { useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient';
import { moduleRoutes } from '../modules/index';

function HomeRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch('/api/user')
            .then((response) => {
                if (!response.ok) {
                    navigate('/login', { replace: true });
                    return null;
                }

                navigate('/dashboard', { replace: true });
                return null;
            })
            .catch(() => navigate('/login', { replace: true }));
    }, [navigate]);

    return <div />;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Outlet />,
        children: [
            { index: true, element: <HomeRedirect /> },
            ...moduleRoutes,
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
