import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { moduleRoutes } from '../modules/index';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Outlet />,
        children: moduleRoutes,
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
