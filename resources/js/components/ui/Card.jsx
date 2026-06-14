import { shadowClass, surfaceClass } from './theme';

export default function Card({ className = '', children }) {
    return (
        <div className={`rounded-[var(--crm-radius-2xl)] p-6 ${surfaceClass} ${shadowClass} ${className}`}>
            {children}
        </div>
    );
}
