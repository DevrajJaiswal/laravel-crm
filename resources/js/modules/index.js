// Direct imports for reliability
import { routes as leadRoutes } from './leads/routes.jsx';
import { routes as dealRoutes } from './deals/routes.jsx';
import { routes as ticketRoutes } from './tickets/routes.jsx';
import { routes as customerRoutes } from './customers/routes.jsx';
import { routes as authRoutes } from './auth/routes.jsx';
import { routes as accessControlRoutes } from './access-control/routes.jsx';
import { routes as usersRoutes } from './users/routes.jsx';
import { routes as setupRoutes } from './setup/routes.jsx';

export const moduleRoutes = [
    ...setupRoutes,
    ...authRoutes,
    ...accessControlRoutes,
    ...leadRoutes,
    ...dealRoutes,
    ...ticketRoutes,
    ...customerRoutes,
    ...usersRoutes,
];

// Direct imports for widgets
import { widgets as setupWidgets } from './setup/widgets.jsx';

export const moduleWidgets = [
    ...setupWidgets,
];
