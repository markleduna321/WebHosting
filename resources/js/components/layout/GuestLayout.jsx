import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_45%,_#cbd5e1)] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">AsuraTECH</p>
                        <h1 className="text-lg font-semibold text-slate-900">Classroom Workspace</h1>
                    </div>

                    <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Public navigation">
                        <Link href="/browse/classrooms" className="rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100">
                            Browse
                        </Link>
                        <Link href="/login" className="rounded-full px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100">
                            Login
                        </Link>
                        <Link href="/register" className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700">
                            Register
                        </Link>
                    </nav>
                </header>

                <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
