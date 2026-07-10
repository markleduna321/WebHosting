import { router } from '@inertiajs/react';

export default function Topbar({ user, onMenuClick = () => {} }) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 lg:pl-8">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 lg:hidden"
                >
                    Menu
                </button>

                <div className="hidden lg:block">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Production workspace</p>
                    <p className="text-sm text-slate-300">Authenticated classroom management and realtime participation</p>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 sm:block">
                        {user?.name || 'User'}
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}