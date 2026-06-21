import { Button, Card, ModuleLayout } from '../../components/ui';

export default function RegisterPage() {
    return (
        <ModuleLayout className="flex items-center justify-center">
            <Card className="w-full max-w-md p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Registration disabled</p>
                <h1 className="mt-3 text-3xl font-black text-slate-950">Use CRM Users</h1>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                    Public registration is turned off. Users are created by authorized CRM admins from the Users module.
                </p>
                <Button to="/login" className="mt-6 w-full">
                    Back to Login
                </Button>
            </Card>
        </ModuleLayout>
    );
}
