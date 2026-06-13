import TicketList from './TicketList';
import TicketCreate from './TicketCreate';
import TicketDetail from './TicketDetail';
import TicketEdit from './TicketEdit';

export const routes = [
    { path: 'tickets', element: <TicketList /> },
    { path: 'tickets/create', element: <TicketCreate /> },
    { path: 'tickets/:id', element: <TicketDetail /> },
    { path: 'tickets/:id/edit', element: <TicketEdit /> },
];
