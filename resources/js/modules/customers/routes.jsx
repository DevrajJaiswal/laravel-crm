import CustomersList from './CustomersList';
import CustomerDetail from './CustomerDetail';
import CustomerCreate from './CustomerCreate';
import CustomerEdit from './CustomerEdit';

export const routes = [
    { path: 'customers', element: <CustomersList /> },
    { path: 'customers/create', element: <CustomerCreate /> },
    { path: 'customers/:id', element: <CustomerDetail /> },
    { path: 'customers/:id/edit', element: <CustomerEdit /> },
];
