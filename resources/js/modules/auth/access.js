export const privilegedRoles = ['super-admin', 'administrator'];

export function isPrivilegedUser(user) {
    return privilegedRoles.some((role) => user?.roles?.includes(role));
}

export function canAccess(user, permission) {
    if (isPrivilegedUser(user) || user?.permissions?.includes(permission)) {
        return true;
    }

    const module = permission.split('.')[0];
    const aliases = {
        users: ['manage-users'],
        roles: ['manage-roles'],
        settings: ['manage-settings'],
    };

    return (aliases[module] || []).some((alias) => user?.permissions?.includes(alias));
}

function humanize(value = '') {
    return value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_.]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function permissionSegment(permission = '') {
    return permission.split('.')[0] || '';
}

function permissionAction(permission = '') {
    return permission.split('.')[1] || '';
}

export function permissionGroupLabel(permission) {
    const segment = permissionSegment(permission);

    if (segment.startsWith('manage-')) {
        return humanize(segment.replace(/^manage-/, ''));
    }

    return humanize(segment);
}

export function permissionActionLabel(permission) {
    const segment = permissionSegment(permission);
    const action = permissionAction(permission) || permission;

    if (segment.startsWith('manage-') && !permission.includes('.')) {
        return 'Select All';
    }

    return humanize(action);
}

export function permissionActionOrder(permission) {
    const segment = permissionSegment(permission);
    const action = (permissionAction(permission) || '').toLowerCase();
    const order = {
        manage: 0,
        view: 1,
        create: 2,
        update: 3,
        edit: 3,
        delete: 4,
    };

    if (segment.startsWith('manage-') && !permission.includes('.')) {
        return order.manage;
    }

    return order[action] || 99;
}
