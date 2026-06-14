import ImportForm from './ImportForm';

export default function ImportPage() {
    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Import</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">CSV / XLSX Import</h2>
                <p className="mt-2 text-sm text-slate-600">Upload a CSV or XLSX file to create CRM records in bulk.</p>
            </div>
            <ImportForm />
        </div>
    );
}
