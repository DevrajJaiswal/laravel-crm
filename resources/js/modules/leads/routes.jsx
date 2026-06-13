import LeadsList from './LeadsList';
import LeadCreate from './LeadCreate';
import LeadDetail from './LeadDetail';
import LeadEdit from './LeadEdit';

export const routes = [
    { path: 'leads', element: <LeadsList /> },
    { path: 'leads/create', element: <LeadCreate /> },
    { path: 'leads/:id', element: <LeadDetail /> },
    { path: 'leads/:id/edit', element: <LeadEdit /> },
];
