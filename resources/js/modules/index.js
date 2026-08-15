// Direct imports for reliability
import { routes as leadRoutes } from './leads/routes.jsx';
import { routes as dealRoutes } from './deals/routes.jsx';
import { routes as ticketRoutes } from './tickets/routes.jsx';
import { routes as dataTransferRoutes } from './data-transfer/routes.jsx';
import { routes as customerRoutes } from './customers/routes.jsx';
import { routes as authRoutes } from './auth/routes.jsx';
import { routes as accessControlRoutes } from './access-control/routes.jsx';
import { routes as usersRoutes } from './users/routes.jsx';
import { routes as reportRoutes } from './reports/routes.jsx';

export const moduleRoutes = [
    ...authRoutes,
    ...accessControlRoutes,
    ...leadRoutes,
    ...dealRoutes,
    ...ticketRoutes,
    ...dataTransferRoutes,
    ...customerRoutes,
    ...reportRoutes,
    ...usersRoutes,
];
