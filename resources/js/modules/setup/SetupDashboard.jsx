import { moduleWidgets } from '../index';
import { Button, Card, ModuleLayout, PageHeader, StatCard, Badge } from '../../components/ui';

export default function SetupDashboard() {
    return (
        <ModuleLayout className="flex items-center justify-center">
            <div className="w-full max-w-none">
                <PageHeader
                    eyebrow="Laravel CRM Progress"
                    title="Build your CRM one module at a time."
                    description="Each module is self-contained. Remove any module folder to delete its features."
                />

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <StatCard label="Modules" value={moduleWidgets.length} detail="Progress widgets tracked in the setup view." />
                    <StatCard label="Completion" value="13/13" detail="Feature modules are complete." tone="success" />
                    <StatCard label="Structure" value="Modular" detail="Module-owned code stays inside app/Modules." tone="info" />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                    <Card className="p-8 lg:p-10">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <Badge>Module Status</Badge>
                            <Button to="/dashboard" variant="secondary" size="sm">
                                Open Dashboard
                            </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {moduleWidgets.map((widget) => (
                                <div
                                    key={widget.id}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
                                >
                                    <span>{widget.title}</span>
                                    <Badge tone={widget.complete ? 'success' : 'default'}>
                                        {widget.complete ? 'Done' : 'Pending'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Current Module</p>
                        <h2 className="mt-4 text-2xl font-bold text-slate-950">Data Transfer</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            The CRM now includes the renamed Data Transfer module, with module-owned import/export screens and module-local tests.
                        </p>
                        <div className="mt-6 grid gap-3">
                            <Button to="/customers" variant="secondary" className="w-full justify-start">
                                Open Customers
                            </Button>
                            <Button to="/deals" variant="secondary" className="w-full justify-start">
                                Open Deals
                            </Button>
                            <Button to="/tickets" variant="secondary" className="w-full justify-start">
                                Open Tickets
                            </Button>
                            <Button to="/leads" variant="secondary" className="w-full justify-start">
                                Open Leads
                            </Button>
                            <Button to="/data-transfer" variant="secondary" className="w-full justify-start">
                                Open Data Transfer
                            </Button>
                            <Button to="/reports" variant="secondary" className="w-full justify-start">
                                Open Reports
                            </Button>
                            <Button to="/access-control/roles" variant="secondary" className="w-full justify-start">
                                Open Roles & Permissions
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
