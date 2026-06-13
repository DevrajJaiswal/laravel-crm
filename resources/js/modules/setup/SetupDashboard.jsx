const setupChecks = [
    'Laravel application bootstrapped in the project root',
    'React frontend mounted through Vite',
    'Tailwind CSS available for the UI layer',
    'Sanctum installed for API authentication',
    'Modular monolith structure started with Core and Setup module',
];

const apiEndpoints = [
    'GET /up',
    'GET /api/health',
    'GET /sanctum/csrf-cookie',
];

export default function SetupDashboard() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff5d6_0%,_#f7fafc_42%,_#dbeafe_100%)] text-slate-900">
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
                <div className="mb-10 inline-flex w-fit items-center gap-3 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm backdrop-blur">
                    Module 1
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Project Setup
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.10)] backdrop-blur lg:p-12">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
                            Laravel CRM
                        </p>
                        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                            The CRM foundation is running with an API-first setup.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            This starter screen confirms our Laravel backend, React frontend, Tailwind styling,
                            and Sanctum-ready authentication foundation are wired into one root application.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {setupChecks.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm font-medium text-slate-700"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-[0_24px_64px_rgba(15,23,42,0.28)]">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                Ready Endpoints
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-200">
                                {apiEndpoints.map((endpoint) => (
                                    <li key={endpoint} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                        {endpoint}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Next Approved Module
                            </p>
                            <h2 className="mt-4 text-2xl font-bold text-slate-950">Authentication</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Once you approve Module 2, we will build login, logout, profile APIs, and the first
                                protected dashboard.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
