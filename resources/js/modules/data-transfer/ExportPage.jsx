import ExportForm from './ExportForm';

export default function ExportPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Export</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">CSV / XLSX Export</h2>
                <p className="mt-2 text-sm text-slate-600">Download CRM data exports as CSV or XLSX files.</p>
            </div>
            <ExportForm />
        </div>
    );
}

