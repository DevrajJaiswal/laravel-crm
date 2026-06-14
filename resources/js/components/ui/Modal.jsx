export default function Modal({ open, title, children, onClose }) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.30)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-950">{title}</h2>
                    <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                        Close
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
