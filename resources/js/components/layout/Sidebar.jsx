import { Link } from '@inertiajs/react';
import NavLink from '@/components/ui/NavLink';

const navigation = [
    {
        href: '/browse/classrooms',
        label: 'Browse classrooms',
        description: 'Discover public classrooms and active live sessions',
    },
    {
        href: '/classrooms',
        label: 'Teacher workspace',
        description: 'Publish classrooms, start sessions, and manage content',
    },
    {
        href: '/profile',
        label: 'Profile settings',
        description: 'Update your account information and password',
    },
];

export default function Sidebar({ open = false, onClose = () => {}, user }) {
    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950 px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
                <div className="flex h-full flex-col gap-6">
                    <div className="flex items-start justify-between gap-4">
                        <Link href="/classrooms" className="block">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">AsuraTECH</p>
                            <h1 className="mt-1 text-2xl font-semibold text-white">Classroom Workspace</h1>
                        </Link>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/5 lg:hidden"
                        >
                            Close
                        </button>
                    </div>

                    <nav className="space-y-2" aria-label="Sidebar navigation">
                        {navigation.map((item) => (
                            <NavLink key={item.href} href={item.href} label={item.label} description={item.description} onClick={onClose} />
                        ))}
                    </nav>

                    <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
                        <p className="mt-2 font-medium text-white">{user?.name || 'Workspace user'}</p>
                        <p className="mt-1 text-xs text-slate-400">Use the sidebar to move between classroom publishing, browsing, and profile settings.</p>
                    </div>
                </div>
            </aside>

            {open ? (
                <button
                    type="button"
                    aria-label="Close navigation overlay"
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
                />
            ) : null}
        </>
    );
}