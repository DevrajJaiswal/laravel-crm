import { NavLink, Outlet } from 'react-router-dom';
import { Card, ModuleLayout, PageHeader } from '../../components/ui';

const tabClassName = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
        isActive
            ? 'bg-slate-950 text-white shadow'
            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
    }`;

export default function DataTransferPage() {
    return (
        <ModuleLayout>
            <div className="w-full space-y-6">
                <PageHeader
                    eyebrow="Data Transfer"
                    title="Data Transfer"
                    description="Import, export, and review transfer history in one place."
                    breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Data Transfer' }]}

                />

                <Card className="mb-4 p-3">
                    <div className="flex flex-wrap gap-2">
                        <NavLink to="import" end className={tabClassName}>
                            Import
                        </NavLink>
                        <NavLink to="export" className={tabClassName}>
                            Export
                        </NavLink>
                        <NavLink to="history" className={tabClassName}>
                            History
                        </NavLink>
                    </div>
                </Card>

                <Card>
                    <Outlet />
                </Card>
            </div>
        </ModuleLayout>
    );
}

