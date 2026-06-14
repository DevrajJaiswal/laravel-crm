import { NavLink, Outlet } from 'react-router-dom';

export default function ImportExportPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f6ff_0%,_#f4f4ff_42%,_#eef2ff_100%)] p-6 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Import & Export</p>
                        <h1 className="mt-3 text-3xl font-black text-slate-950">Data Import & Export</h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <NavLink to="/dashboard" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                            Back to dashboard
                        </NavLink>
                    </div>
                </div>

                <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        <NavLink
                            to="import"
                            end
                            className={({ isActive }) =>
                                `rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-slate-950 text-white shadow' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`
                            }
                        >
                            Import
                        </NavLink>
                        <NavLink
                            to="export"
                            className={({ isActive }) =>
                                `rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-slate-950 text-white shadow' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`
                            }
                        >
                            Export
                        </NavLink>
                        <NavLink
                            to="history"
                            className={({ isActive }) =>
                                `rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-slate-950 text-white shadow' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`
                            }
                        >
                            History
                        </NavLink>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}
