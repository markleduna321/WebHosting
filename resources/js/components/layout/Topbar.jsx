import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { openMobileSidebar, selectMobileSidebarOpen } from '@/features/ui/uiSlice';

const FOCUS_RING =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

export default function Topbar({ title = 'Dashboard', subtitle }) {
    const dispatch = useDispatch();
    const mobileOpen = useSelector(selectMobileSidebarOpen);

    const { auth } = usePage().props;
    const user = auth?.user;
    const planName = user?.plan ?? 'Student Pro';
    const displaySubtitle = subtitle ?? `${user?.name ?? 'Account'} · ${planName} plan`;
    const initial = (user?.name ?? 'A').charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 sm:gap-4 sm:px-6 lg:px-8">
            <button
                type="button"
                onClick={() => dispatch(openMobileSidebar())}
                aria-label="Open sidebar"
                aria-expanded={mobileOpen}
                className={`lg:hidden p-1.5 -ml-1 rounded-md text-slate-500 hover:bg-slate-100 transition-colors ${FOCUS_RING}`}
            >
                <Menu aria-hidden="true" className="w-5 h-5" />
            </button>

            <div className="min-w-0">
                <h1 className="text-base font-bold text-slate-900 truncate sm:text-lg">{title}</h1>
                <p className="text-xs text-slate-500 truncate">{displaySubtitle}</p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Link
                    href="/hosting"
                    className={`hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-blue-600 shadow-sm hover:bg-slate-50 transition-colors ${FOCUS_RING}`}
                >
                    Upgrade plan
                </Link>

                <button
                    type="button"
                    aria-label="Notifications"
                    className={`relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors ${FOCUS_RING}`}
                >
                    <Bell aria-hidden="true" className="w-5 h-5" />
                </button>

                <Link
                    href="/account/settings"
                    aria-label="Account settings"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-700 ${FOCUS_RING}`}
                >
                    <span aria-hidden="true">{initial}</span>
                </Link>
            </div>
        </header>
    );
}
