import ExportForm from './ExportForm';
import { PageHeader } from '../../components/ui';

export default function ExportPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Export"
                title="CSV / XLSX Export"
                description="Download CRM data exports as CSV or XLSX files."
            />
            <ExportForm />
        </div>
    );
}

