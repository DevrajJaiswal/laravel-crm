import { NavLink, Outlet } from 'react-router-dom';
import { Card } from '../../components/ui';

const tabClassName = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
        isActive
            ? 'bg-slate-950 text-white shadow'
            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
    }`;

export default function DataTransferHistoryPage() {
    return (
        <div className="space-y-4">
            <Card className="p-3">
                <div className="flex flex-wrap gap-2">
                    <NavLink to="" end className={tabClassName}>
                        All History
                    </NavLink>
                    <NavLink to="imports" className={tabClassName}>
                        Import History
                    </NavLink>
                    <NavLink to="exports" className={tabClassName}>
                        Export History
                    </NavLink>
                </div>
            </Card>

            <Outlet />
        </div>
    );
}
