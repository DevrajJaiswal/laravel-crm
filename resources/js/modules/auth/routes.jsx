import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';

export const routes = [
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
    { path: 'dashboard', element: <Dashboard /> },
];
