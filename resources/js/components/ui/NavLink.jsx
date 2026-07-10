import { Link, usePage } from '@inertiajs/react';

export default function NavLink({ href, label, description, onClick }) {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`group flex items-start gap-3 rounded-2xl px-4 py-3 text-left transition ${isActive ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
        >
            <span className={`mt-1 h-2.5 w-2.5 rounded-full transition ${isActive ? 'bg-emerald-400' : 'bg-slate-500 group-hover:bg-slate-200'}`} />
            <span>
                <span className="block text-sm font-medium">{label}</span>
                {description ? <span className={`mt-1 block text-xs ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{description}</span> : null}
            </span>
        </Link>
    );
}