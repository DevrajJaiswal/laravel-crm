import { pageBackgroundClass } from './theme';

export default function PageContainer({ className = '', children }) {
    return (
        <main className={`min-h-screen w-full ${pageBackgroundClass} px-4 py-6 text-slate-900 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </main>
    );
}
