import UsersList from './UsersList';
import UserEdit from './UserEdit';

export const routes = [
    { path: 'users', element: <UsersList /> },
    { path: 'users/:id/edit', element: <UserEdit /> },
];
