import DealPipeline from './DealPipeline';
import DealCreate from './DealCreate';
import DealDetail from './DealDetail';
import DealEdit from './DealEdit';

export const routes = [
    { path: 'deals', element: <DealPipeline /> },
    { path: 'deals/create', element: <DealCreate /> },
    { path: 'deals/:id', element: <DealDetail /> },
    { path: 'deals/:id/edit', element: <DealEdit /> },
];
