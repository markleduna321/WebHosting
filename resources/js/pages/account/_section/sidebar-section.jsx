import { Link, usePage } from "@inertiajs/react";
import {
    LayoutGrid,
    Server,
    Globe,
    Link2,
    Rocket,
    CreditCard,
    BookOpen,
    LifeBuoy,
    Settings,
    LogOut,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronRightIcon,
    X,
    FolderOpen,
    Database,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const NAV_LINKS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Hosting Plan", href: "/hosting-plan", icon: Server },
    {
        name: "Website",
        href: "/websites",
        icon: Globe,
        children: [
            { name: "Files", href: "/websites/files", icon: FolderOpen },
            { name: "Databases", href: "/websites/databases", icon: Database },
        ],
    },
    { name: "Domains", href: "/domains", icon: Link2 },
    { name: "Deployments", href: "/deployments", icon: Rocket },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
    { name: "Support", href: "/support", icon: LifeBuoy },
    { name: "Account Settings", href: "/account/settings", icon: Settings },
];

export default function SidebarSection({
    collapsed = false,
    mobileOpen = false,
    onToggleCollapse,
    onCloseMobile,
}) {
    const { url } = usePage();
    const [openMenus, setOpenMenus] = useState({});

    const isLinkActive = (href) => url === href || url.startsWith(`${href}/`);

    // Auto-expand a parent menu if the current URL matches one of its children
    useEffect(() => {
        const next = {};
        NAV_LINKS.forEach((link) => {
            if (link.children) {
                const childActive = link.children.some((child) =>
                    isLinkActive(child.href),
                );
                if (childActive || isLinkActive(link.href)) {
                    next[link.name] = true;
                }
            }
        });
        setOpenMenus((prev) => ({ ...prev, ...next }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    const toggleMenu = (name) => {
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const content = (
        <div className="flex h-full flex-col bg-white border-r border-gray-100">
            {/* Brand Header */}
            <div
                className={`flex items-center h-16 shrink-0 border-b border-gray-100 ${
                    collapsed ? "justify-center px-2" : "justify-between px-5"
                }`}
            >
                <Link href="/" className="flex items-center gap-2 min-w-0">
                    <img
                        src="/images/asura-logo.png"
                        alt="AsuraTechHost Logo"
                        className="w-8 h-8 object-contain shrink-0"
                    />
                    {!collapsed && (
                        <span className="text-2xl font-extrabold text-slate-900 ">
                            Asura<span className="text-blue-600"></span>
                            <span className="text-blue-600">Host</span>
                        </span>
                    )}
                </Link>
                <button
                    type="button"
                    onClick={onCloseMobile}
                    aria-label="Close sidebar"
                    className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Search */}
            {!collapsed && (
                <div className="px-4 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    const hasChildren = !!link.children;
                    const isActive = isLinkActive(link.href);
                    const isOpen = !!openMenus[link.name];

                    if (hasChildren) {
                        return (
                            <div key={link.name}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (collapsed) return;
                                        toggleMenu(link.name);
                                    }}
                                    title={collapsed ? link.name : undefined}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        collapsed ? "justify-center px-2" : ""
                                    } ${
                                        isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    {!collapsed && (
                                        <>
                                            <span className="truncate flex-1 text-left">
                                                {link.name}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                                                    isOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </>
                                    )}
                                </button>

                                {!collapsed && isOpen && (
                                    <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                                        {link.children.map((child) => {
                                            const ChildIcon = child.icon;
                                            const childActive = isLinkActive(
                                                child.href,
                                            );
                                            return (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                                        childActive
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`}
                                                >
                                                    <ChildIcon className="w-4 h-4 shrink-0" />
                                                    <span className="truncate">
                                                        {child.name}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            title={collapsed ? link.name : undefined}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                collapsed ? "justify-center px-2" : ""
                            } ${
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!collapsed && (
                                <span className="truncate">{link.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Log out */}
            <div className="border-t border-gray-100 p-3">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    title={collapsed ? "Log out" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
                        collapsed ? "justify-center px-2" : ""
                    }`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop persistent sidebar */}
            <div
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
                    collapsed ? "w-20" : "w-72"
                }`}
            >
                {content}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    aria-label={
                        collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                    className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-blue-600"
                >
                    {collapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                        <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div
                        className="absolute inset-0 bg-slate-900/50"
                        onClick={onCloseMobile}
                    />
                    <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}
