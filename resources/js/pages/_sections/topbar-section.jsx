import { Link, usePage } from "@inertiajs/react";
import { Bell, Menu, Plus } from "lucide-react";
import React from "react";

export default function TopbarSection({
    title = "Dashboard",
    subtitle,
    onOpenMobileSidebar,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const planName = user?.plan ?? "Student Pro";
    const displaySubtitle = subtitle ?? `${user?.name ?? "Account"} · ${planName} plan`;
    const initial = (user?.name ?? "A").charAt(0).toUpperCase();

    return (
        <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-4 sm:px-6">
            <button
                type="button"
                onClick={onOpenMobileSidebar}
                aria-label="Open sidebar"
                className="lg:hidden p-1.5 -ml-1 rounded-md text-slate-500 hover:bg-slate-100"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 truncate">
                    {title}
                </h1>
                <p className="text-xs text-slate-500 truncate">
                    {displaySubtitle}
                </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <Link
                    href="/hosting-plan"
                    className="hidden sm:inline-flex items-center rounded-md border text-blue-600 border-slate-200 bg-white px-3.5 py-2 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
                >
                    Upgrade plan
                </Link>

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Bell className="w-5 h-5" />
                </button>


                <Link
                    href="/account/settings"
                    aria-label="Account settings"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                >
                    {initial}
                </Link>
            </div>
        </div>
    );
}
