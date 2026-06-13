import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../shared/apiClient';

const stageColors = {
    Prospecting: 'bg-slate-100 text-slate-700',
    Qualification: 'bg-cyan-100 text-cyan-800',
    Proposal: 'bg-indigo-100 text-indigo-800',
    Negotiation: 'bg-amber-100 text-amber-800',
    Won: 'bg-emerald-100 text-emerald-800',
    Lost: 'bg-rose-100 text-rose-800',
};

export default function DealPipeline() {
    const [stages, setStages] = useState([]);
    const [dealsByStage, setDealsByStage] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDeals = () => {
        setLoading(true);
        apiFetch('/api/deals')
            .then((response) => response.json())
            .then((payload) => {
                setStages(payload.stages || []);
                setDealsByStage(payload.data || {});
            })
            .catch(() => setError('Failed to load deals'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDeals();
    }, []);

    const moveDeal = async (deal, stage) => {
        if (deal.stage === stage) {
            return;
        }

        const response = await apiFetch(`/api/deals/${deal.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                customer_id: deal.customer_id,
                title: deal.title,
                amount: deal.amount,
                stage,
                probability: deal.probability,
                expected_close_date: deal.expected_close_date,
                notes: deal.notes,
            }),
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => ({}));
            setError(payload.message || 'Failed to move deal');
            return;
        }

        loadDeals();
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_42%,_#dbeafe_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Deal Management</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">Sales Pipeline</h1>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/deals/create" className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white">
                            Create Deal
                        </Link>
                        <Link to="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                {error ? <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

                {loading ? (
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">Loading pipeline...</div>
                ) : (
                    <div className="grid gap-4 overflow-x-auto pb-2 xl:grid-cols-6">
                        {stages.map((stage) => (
                            <section key={stage} className="min-w-[280px] rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-sm">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-950">{stage}</h2>
                                        <p className="text-xs uppercase tracking-wider text-slate-500">
                                            {(dealsByStage[stage] || []).length} deals
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${stageColors[stage] || 'bg-slate-100 text-slate-700'}`}>
                                        {stage}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {(dealsByStage[stage] || []).map((deal) => (
                                        <article key={deal.id} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-950">{deal.title}</h3>
                                                    <p className="mt-1 text-sm text-slate-600">{deal.customer?.company_name}</p>
                                                </div>
                                                <Link
                                                    to={`/deals/${deal.id}/edit`}
                                                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                                                >
                                                    Edit
                                                </Link>
                                            </div>

                                            <div className="mt-3 grid gap-2 text-sm text-slate-600">
                                                <p><span className="font-semibold text-slate-800">Amount:</span> {deal.amount}</p>
                                                <p><span className="font-semibold text-slate-800">Owner:</span> {deal.owner?.name || '-'}</p>
                                                <p><span className="font-semibold text-slate-800">Close:</span> {deal.expected_close_date || '-'}</p>
                                            </div>

                                            <div className="mt-4">
                                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    Move Stage
                                                </label>
                                                <select
                                                    value={deal.stage}
                                                    onChange={(event) => moveDeal(deal, event.target.value)}
                                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500"
                                                >
                                                    {stages.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
