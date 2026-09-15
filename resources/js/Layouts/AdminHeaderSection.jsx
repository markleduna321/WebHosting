import React from 'react';
import { ChevronRight, Plus, Shield, Users, BarChart3 } from 'lucide-react';
import { getAdminHeaderMeta } from '@/components/layout/navConfig';

const ACTION_ICONS = {
    'Create plan': Plus,
    'Invite student': Users,
    'New tenant': Shield,
    'Create custom role': Shield,
    '12 months': BarChart3,
};

export default function AdminHeaderSection({ href = '/dashboard', onAction, onSecondaryAction }) {
    const meta = getAdminHeaderMeta(href);
    const ActionIcon = meta.actionLabel ? ACTION_ICONS[meta.actionLabel] : null;

    return (
        <div className="font-sans">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <nav className="flex items-center gap-1.5 text-sm text-slate-500">
                        <span className="hover:text-slate-700 cursor-pointer">Admin</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate text-slate-700 font-medium">
                            {meta.breadcrumb}
                        </span>
                    </nav>

                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight capitalize">
                        {meta.title}
                    </h1>

                    <p className="mt-1 text-sm sm:text-base text-slate-500 max-w-3xl leading-relaxed">
                        {meta.subtitle}
                    </p>
                </div>

                {meta.actionLabel && (
                    <div className="shrink-0 pt-6 sm:pt-5">
                        {meta.actionSecondaryLabel ? (
                            <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                                <button
                                    type="button"
                                    onClick={onSecondaryAction}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                                >
                                    {meta.actionSecondaryLabel}
                                </button>
                                <button
                                    type="button"
                                    onClick={onAction}
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                >
                                    {meta.actionLabel}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={onAction}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                {ActionIcon && <ActionIcon className="h-4 w-4" />}
                                {meta.actionLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}