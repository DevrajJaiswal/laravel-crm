// Direct imports for reliability
import { routes as authRoutes } from './auth/routes.jsx';
import { routes as usersRoutes } from './users/routes.jsx';
import { routes as setupRoutes } from './setup/routes.jsx';

export const moduleRoutes = [
    ...setupRoutes,
    ...authRoutes,
    ...usersRoutes,
];

// Direct imports for widgets
import { widgets as setupWidgets } from './setup/widgets.jsx';

export const moduleWidgets = [
    ...setupWidgets,
];
