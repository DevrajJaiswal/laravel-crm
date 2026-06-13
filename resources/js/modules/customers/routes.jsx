import CustomersList from './CustomersList';
import CustomerDetail from './CustomerDetail';

export const routes = [
    { path: 'customers', element: <CustomersList /> },
    { path: 'customers/:id', element: <CustomerDetail /> },
];
