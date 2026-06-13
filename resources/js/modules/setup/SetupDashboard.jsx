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
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm font-medium text-slate-700"
                                >
                                    <span className={widget.complete ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-400'}>
                                        {widget.complete ? 'Done' : 'Pending'}
                                    </span>
                                    {widget.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_24px_64px_rgba(15,23,42,0.28)]">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                Current Module
                            </p>
                            <h2 className="mt-4 text-2xl font-bold">Activities</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                The CRM is now through Module 8, with Activities shown as a timeline inside Customer Details and tracked in the progress board.
                            </p>
                            <div className="mt-6 space-y-3">
                                <a href="/customers" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                    Open Customers
                                </a>
                                <a href="/leads" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                    Open Leads
                                </a>
                                <a href="/access-control/roles" className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                    Open Roles & Permissions
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
