// Auto-discover modules and their routes
const modules = import.meta.glob('./*/routes.jsx', { eager: true });

export const moduleRoutes = Object.entries(modules).flatMap(([path, module]) => {
    return module.routes || [];
});

// Auto-discover module widgets for dashboard
const widgets = import.meta.glob('./*/widgets.jsx', { eager: true });

export const moduleWidgets = Object.entries(widgets).flatMap(([path, widget]) => {
    return widget.widgets || [];
});
