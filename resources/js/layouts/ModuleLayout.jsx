import { pageBackgroundClass } from '../components/ui/theme';

export default function ModuleLayout({ className = '', children }) {
    return (
        <main className={`min-h-screen w-full ${pageBackgroundClass} px-4 py-6 text-slate-900 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </main>
    );
}
