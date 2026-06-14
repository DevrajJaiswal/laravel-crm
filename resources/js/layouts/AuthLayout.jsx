import Card from '../components/ui/Card';
import { pageBackgroundClass } from '../components/ui/theme';

export default function AuthLayout({ title, description, children }) {
    return (
        <main className={`min-h-screen w-full ${pageBackgroundClass} px-4 py-6 text-slate-900 sm:px-6 lg:px-8`}>
            <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
                <Card className="w-full max-w-md p-8">
                    {title ? <h1 className="text-3xl font-black text-slate-950">{title}</h1> : null}
                    {description ? <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p> : null}
                    <div className="mt-6">{children}</div>
                </Card>
            </div>
        </main>
    );
}
