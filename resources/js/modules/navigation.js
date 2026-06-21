export const dashboardLinks = [
    { href: '/users', title: 'Users Management', description: 'Create, edit, and delete CRM users.', permission: 'users.view' },
    { href: '/access-control/roles', title: 'Roles & Permissions', description: 'Manage role access and permission assignment.', permission: 'manage-roles' },
    { href: '/leads', title: 'Leads', description: 'Track and manage sales opportunities.', permission: 'leads.view' },
    { href: '/deals', title: 'Deals', description: 'Manage pipeline stages and sales forecasts.', permission: 'deals.view' },
    { href: '/tickets', title: 'Support Tickets', description: 'Track customer issues and resolutions.', permission: 'tickets.view' },
    { href: '/customers', title: 'Customers', description: 'View customer accounts and details.', permission: 'customers.view' },
    { href: '/data-transfer', title: 'Data Transfer', description: 'Bulk import or export CRM data.', permission: 'data-transfer.import' },
    { href: '/reports', title: 'Reports', description: 'View CRM analytics and summary dashboards.', permission: 'reports.view' },
];
