import { Link, usePage } from "@inertiajs/react";
import {
    LayoutGrid,
    Users,
    Server,
    CreditCard,
    LifeBuoy,
    Monitor,
    Handshake,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Globe,
    BookOpen,
    Database,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const DASHBOARD_LINK = {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
};

const ADMIN_NAV_GROUPS = [
    {
        name: "User Management",
        icon: Users,
        children: [
            { name: "Students", href: "/admin/users/students" },
            { name: "Admins", href: "/admin/users/admins" },
            {
                name: "Roles & Permissions",
                href: "/admin/users/roles-permissions",
            },
        ],
    },
    {
        name: "Hosting Management",
        icon: Server,
        children: [
            { name: "Hosting Plans", href: "/admin/hosting/plans" },
            { name: "Websites", href: "/admin/hosting/websites" },
            { name: "Servers", href: "/admin/hosting/servers" },
            { name: "Storage", href: "/admin/hosting/storage" },
            { name: "Bandwidth", href: "/admin/hosting/bandwidth" },
            { name: "Domains", href: "/admin/hosting/domains" },
            {
                name: "SSL Certificates",
                href: "/admin/hosting/ssl-certificates",
            },
            { name: "Databases", href: "/admin/hosting/databases" },
            { name: "Deployments", href: "/admin/hosting/deployments" },
        ],
    },
    {
        name: "Subscription & Billing",
        icon: CreditCard,
        children: [
            { name: "Subscriptions", href: "/admin/billing/subscriptions" },
            { name: "Payments", href: "/admin/billing/payments" },
            { name: "Transactions", href: "/admin/billing/transactions" },
            { name: "Invoices", href: "/admin/billing/invoices" },
            { name: "Coupons & Discounts", href: "/admin/billing/coupons" },
            { name: "Refunds", href: "/admin/billing/refunds" },
        ],
    },
    {
        name: "Support",
        icon: LifeBuoy,
        children: [
            { name: "Support Tickets", href: "/admin/support/tickets" },
            { name: "Student Messages", href: "/admin/support/messages" },
            { name: "Knowledge Base", href: "/admin/support/knowledge-base" },
            { name: "FAQs", href: "/admin/support/faqs" },
        ],
    },
    {
        name: "Website Management",
        icon: Monitor,
        children: [
            { name: "Homepage Content", href: "/admin/website/homepage" },
            { name: "Hero Section", href: "/admin/website/hero-section" },
            {
                name: "Hosting Plans Content",
                href: "/admin/website/hosting-plans-content",
            },
            { name: "Features", href: "/admin/website/features" },
            { name: "Partners", href: "/admin/website/partners" },
            { name: "Testimonials", href: "/admin/website/testimonials" },
            { name: "FAQs", href: "/admin/website/faqs" },
            { name: "Footer Content", href: "/admin/website/footer" },
        ],
    },
    {
        name: "Partner Management",
        icon: Handshake,
        children: [
            { name: "Partners", href: "/admin/partners" },
            { name: "Partner Logos", href: "/admin/partners/logos" },
            { name: "Partner Details", href: "/admin/partners/details" },
        ],
    },
    {
        name: "Reports",
        icon: BarChart3,
        children: [
            { name: "Revenue Reports", href: "/admin/reports/revenue" },
            { name: "User Reports", href: "/admin/reports/users" },
            { name: "Hosting Reports", href: "/admin/reports/hosting" },
            { name: "Website Reports", href: "/admin/reports/websites" },
            { name: "Payment Reports", href: "/admin/reports/payments" },
            { name: "Server Reports", href: "/admin/reports/servers" },
        ],
    },
];

const USER_NAV_GROUPS = [
    {
        label: "Workspace",
        links: [
            { name: "Dashboard",        href: "/dashboard",        icon: LayoutGrid },
            { name: "Sites & Domains",  href: "/site-domain",    icon: Globe },
            { name: "Files & Database", href: "/files-database",   icon: Database },
            { name: "Account & Billing",href: "/account-billing",  icon: CreditCard },
        ],
    },
    {
        label: "More",
        links: [
            { name: "Hosting Plan",   href: "/hosting",        icon: Server },
            { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
        ],
    },
];

export default function SidebarSection({
    collapsed = false,
    mobileOpen = false,
    onToggleCollapse,
    onCloseMobile,
}) {
    const { url, props } = usePage();
    const isAdministrator = props?.auth?.user?.role === "administrator";
    const isLinkActive = (href) => url === href || url.startsWith(`${href}/`);

    // Admin sidebar: only one group open at a time
    const [openGroup, setOpenGroup] = useState(() => {
        const activeGroup = ADMIN_NAV_GROUPS.find((group) =>
            group.children.some((child) => isLinkActive(child.href)),
        );
        return activeGroup ? activeGroup.name : null;
    });

    useEffect(() => {
        const activeGroup = ADMIN_NAV_GROUPS.find((group) =>
            group.children.some((child) => isLinkActive(child.href)),
        );
        if (activeGroup) {
            setOpenGroup(activeGroup.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    const toggleGroup = (name) => {
        setOpenGroup((prev) => (prev === name ? null : name));
    };

    // User sidebar: any number of menus can be open at once (kept for future use)
    const [openMenus, setOpenMenus] = useState({});

    // eslint-disable-next-line no-unused-vars
    const toggleMenu = (name) => {
        setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const adminContent = (
        <div className="flex h-full flex-col bg-slate-900 border-r border-slate-800">
            {/* Brand Header */}
            <div
                className={`flex items-center h-16 shrink-0 border-b border-slate-800 transition-all duration-300 ${
                    collapsed ? "justify-center px-2" : "justify-between px-5"
                }`}
            >
                <Link
                    href="/"
                    className="flex items-center gap-2.5 min-w-0"
                    onClick={onCloseMobile}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <img
                            src="/images/asura-logo.png"
                            alt="AsuraTech Host"
                            className="h-9 w-9"
                        />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 transition-opacity duration-300">
                            <p className="text-lg font-bold text-white truncate">
                                AsuraTech Host
                            </p>
                            <p className="text-[10px] font-semibold tracking-widest text-blue-400">
                                ADMIN PORTAL
                            </p>
                        </div>
                    )}
                </Link>
                <button
                    type="button"
                    onClick={onCloseMobile}
                    aria-label="Close sidebar"
                    className="lg:hidden p-1.5 rounded-md text-slate-400 hover:bg-slate-800 transition-colors duration-200"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <Link
                    href={DASHBOARD_LINK.href}
                    title={collapsed ? DASHBOARD_LINK.name : undefined}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                        collapsed ? "justify-center px-2" : ""
                    } ${
                        isLinkActive(DASHBOARD_LINK.href)
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                    <DASHBOARD_LINK.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                        <span className="truncate">{DASHBOARD_LINK.name}</span>
                    )}
                </Link>

                <div className="pt-2 space-y-1">
                    {ADMIN_NAV_GROUPS.map((group) => {
                        const Icon = group.icon;
                        const isOpen = openGroup === group.name;
                        const isGroupActive = group.children.some((child) =>
                            isLinkActive(child.href),
                        );

                        return (
                            <div key={group.name}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (collapsed) return;
                                        toggleGroup(group.name);
                                    }}
                                    title={collapsed ? group.name : undefined}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors duration-200 ${
                                        isGroupActive
                                            ? "text-blue-400"
                                            : "text-slate-100"
                                    } ${collapsed ? "justify-center px-2" : ""}`}
                                >
                                    <Icon
                                        className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isGroupActive ? "text-blue-400" : "text-slate-400"}`}
                                    />
                                    {!collapsed && (
                                        <>
                                            <span className="truncate flex-1 text-left">
                                                {group.name}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-300 ease-in-out ${
                                                    isOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </>
                                    )}
                                </button>

                                {!collapsed && (
                                    <div
                                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                                            isOpen
                                                ? "grid-rows-[1fr]"
                                                : "grid-rows-[0fr]"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="mt-1 ml-5 pl-4 border-l border-slate-800 space-y-1">
                                                {group.children.map((child) => {
                                                    const childActive =
                                                        isLinkActive(
                                                            child.href,
                                                        );
                                                    return (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            onClick={
                                                                onCloseMobile
                                                            }
                                                            className={`block truncate rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                                                childActive
                                                                    ? "text-blue-400 font-semibold"
                                                                    : "text-slate-400 hover:text-blue-400"
                                                            }`}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Log out */}
            <div className="border-t border-slate-800 p-3">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    title={collapsed ? "Log out" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200 ${
                        collapsed ? "justify-center px-2" : ""
                    }`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );

    const userContent = (
        <div className="flex h-full flex-col bg-white border-r border-gray-200">
            {/* Brand Header */}
            <div
                className={`flex items-center h-16 shrink-0 border-b border-gray-200 ${
                    collapsed ? "justify-center px-2" : "justify-between px-5"
                }`}
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 min-w-0"
                    onClick={onCloseMobile}
                >
                    <img
                        src="/images/asura-logo.png"
                        alt="AsuraTechHost Logo"
                        className="w-8 h-8 object-contain shrink-0"
                    />
                    {!collapsed && (
                        <span className="text-2xl font-extrabold text-slate-900">
                            Asura<span className="text-blue-600">Host</span>
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

            {/* Nav Groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {USER_NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        {/* Section label */}
                        {!collapsed && (
                            <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {group.label}
                            </p>
                        )}

                        <div className="space-y-0.5">
                            {group.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = isLinkActive(link.href);

                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={onCloseMobile}
                                        title={collapsed ? link.name : undefined}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                            collapsed ? "justify-center px-2" : ""
                                        } ${
                                            isActive
                                                ? "bg-slate-100 text-slate-900"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-4 h-4 shrink-0 ${
                                                isActive
                                                    ? "text-slate-700"
                                                    : "text-slate-400"
                                            }`}
                                        />
                                        {!collapsed && (
                                            <>
                                                <span className="truncate flex-1">
                                                    {link.name}
                                                </span>
                                                {isActive && (
                                                    <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
                                                )}
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Log out */}
            <div className="border-t border-gray-200 p-3">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    title={collapsed ? "Log out" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors ${
                        collapsed ? "justify-center px-2" : ""
                    }`}
                >
                    <LogOut className="w-4 h-4 shrink-0 text-slate-400" />
                    {!collapsed && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );

    const content = isAdministrator ? adminContent : userContent;

    return (
        <>
            {/* Desktop persistent sidebar */}
            <div
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
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
                    className={
                        isAdministrator
                            ? "group absolute -right-3.5 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 shadow-md transition-all duration-200 hover:border-blue-500/50 hover:bg-slate-800 hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            : "absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-blue-600"
                    }
                >
                    {isAdministrator ? (
                        <ChevronLeft
                            className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                                collapsed ? "rotate-180" : ""
                            }`}
                        />
                    ) : collapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                        <ChevronLeft className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>

            {/* Mobile drawer with backdrop fade */}
            <div
                className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
                    mobileOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <div
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                    onClick={onCloseMobile}
                />
                <div
                    className={`absolute inset-y-0 left-0 w-72 shadow-xl transition-transform duration-300 ease-in-out ${
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {content}
                </div>
            </div>
        </>
    );
}
