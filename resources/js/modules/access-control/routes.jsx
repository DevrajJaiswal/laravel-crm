import RolesPage from './RolesPage';
import RolePermissionsPage from './RolePermissionsPage';

export const routes = [
    { path: 'access-control/roles', element: <RolesPage /> },
    { path: 'access-control/roles/:id/permissions', element: <RolePermissionsPage /> },
];
