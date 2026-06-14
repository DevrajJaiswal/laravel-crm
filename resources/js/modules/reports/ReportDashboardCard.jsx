export default function ReportDashboardCard() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Reports</p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">Analytics Dashboard</h3>
            <p className="mt-3 text-sm text-slate-600">Explore summary metrics for leads, customers, deals, and tickets.</p>
            <a
                href="/reports"
                className="mt-5 inline-flex rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
                Open Reports
            </a>
        </div>
    );
}
