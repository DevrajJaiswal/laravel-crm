import { moduleWidgets } from '../index';

export default function SetupDashboard() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] text-slate-900">
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
                <div className="mb-10 inline-flex w-fit items-center gap-3 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm backdrop-blur">
                    Laravel CRM Progress
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur lg:p-12">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
                            Module Status
                        </p>
                        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                            Build your CRM one module at a time.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Each module is self-contained. Remove any module folder to delete its features.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {moduleWidgets.map((widget) => (
                                <div
                                    key={widget.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm font-medium text-slate-700 flex items-center gap-2"
                                >
                                    <span className={widget.complete ? 'text-emerald-500' : 'text-slate-400'}>
                                        {widget.complete ? '✓' : '○'}
                                    </span>
                                    {widget.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_24px_64px_rgba(15,23,42,0.28)]">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                Navigation
                            </p>
                            <div className="mt-6 space-y-3">
                                <a href="/login" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                    Login
                                </a>
                                <a href="/register" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                    Register
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
