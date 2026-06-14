import { Button, Card } from '../../components/ui';

export default function ReportDashboardCard() {
    return (
        <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Reports</p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">Analytics Dashboard</h3>
            <p className="mt-3 text-sm text-slate-600">Explore summary metrics for leads, customers, deals, and tickets.</p>
            <div className="mt-5">
                <Button to="/reports" variant="dark">
                    Open Reports
                </Button>
            </div>
        </Card>
    );
}
