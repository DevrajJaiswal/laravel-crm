import Card from './Card';

export default function StatCard({ label, value, detail, tone = 'default' }) {
    return (
        <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
            <div className="mt-3 text-3xl font-black text-slate-950">{value}</div>
            {detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p> : null}
        </Card>
    );
}
