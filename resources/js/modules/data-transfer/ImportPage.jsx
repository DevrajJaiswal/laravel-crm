import ImportForm from './ImportForm';
import { PageHeader } from '../../components/ui';

export default function ImportPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Import"
                title="CSV / XLSX Import"
                description="Upload a CSV or XLSX file to create CRM records in bulk."
            />
            <ImportForm />
        </div>
    );
}

