import UsersList from './UsersList';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';

export const routes = [
    { path: 'users', element: <UsersList /> },
    { path: 'users/create', element: <UserCreate /> },
    { path: 'users/:id/edit', element: <UserEdit /> },
];
