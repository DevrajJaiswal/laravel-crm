import { createContext } from 'react';
import { pageBackgroundClass } from '../components/ui/theme';

export const LoadingStateContext = createContext('overlay');

export default function ModuleLayout({ className = '', children, loadingVariant = 'overlay' }) {
    return (
        <LoadingStateContext.Provider value={loadingVariant}>
            <main className={`min-h-screen w-full ${pageBackgroundClass} px-4 pt-4 pb-2 text-slate-900 sm:px-6 lg:px-8 ${className}`}>
                {children}
            </main>
        </LoadingStateContext.Provider>
    );
}
