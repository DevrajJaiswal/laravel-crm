import { Button, Card } from '../../components/ui';

export default function DataTransferHome() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Import</p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">Upload CSV / XLSX</h3>
                <p className="mt-2 text-sm text-slate-600">Add customers, leads, contacts, deals, or tickets in bulk.</p>
                <div className="mt-5">
                    <Button to="import" variant="dark">Open Import</Button>
                </div>
            </Card>

            <Card className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Export</p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">Download CSV / XLSX</h3>
                <p className="mt-2 text-sm text-slate-600">Export your CRM records for backup, reporting, or external use.</p>
                <div className="mt-5">
                    <Button to="export" variant="dark">Open Export</Button>
                </div>
            </Card>

            <Card className="p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">History</p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">View transfer history</h3>
                <p className="mt-2 text-sm text-slate-600">See the status of recent import and export jobs in one place.</p>
                <div className="mt-5">
                    <Button to="history" variant="dark">Open History</Button>
                </div>
            </Card>
        </div>
    );
}
