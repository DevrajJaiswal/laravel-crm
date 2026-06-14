import Input from './Input';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="pl-10"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                Search
            </span>
        </div>
    );
}
