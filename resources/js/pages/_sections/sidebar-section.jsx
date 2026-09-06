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
    ChevronDown,
    X,
    Globe,
    BookOpen,
    Database,
    PanelLeftClose,
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
            { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
            { name: "Sites & Domains", href: "/site-domain", icon: Globe },
            { name: "Files & Database", href: "/files-database", icon: Database },
            { name: "Account & Billing", href: "/account-billing", icon: CreditCard },
        ],
    },
    {
        label: "More",
        links: [
            { name: "Hosting Plan", href: "/hosting", icon: Server },
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

    const isExpanded = !collapsed;

    // Admin sidebar accordion state
    const [openGroup, setOpenGroup] = useState(() => {
        const activeGroup = ADMIN_NAV_GROUPS.find((group) =>
            group.children.some((child) => isLinkActive(child.href))
        );
        return activeGroup ? activeGroup.name : null;
    });

    useEffect(() => {
        const activeGroup = ADMIN_NAV_GROUPS.find((group) =>
            group.children.some((child) => isLinkActive(child.href))
        );
        if (activeGroup) {
            setOpenGroup(activeGroup.name);
        }
    }, [url]);

    const toggleGroup = (name) => {
        setOpenGroup((prev) => (prev === name ? null : name));
    };

    const adminContent = (
        <div className="flex h-full flex-col bg-slate-900 border-r border-slate-800 text-slate-100">
            {/* Header / Brand & Toggle */}
            <div
                className={`flex items-center h-16 shrink-0 px-3.5 border-b border-slate-800/80 ${
                    collapsed ? "justify-center" : "justify-between"
                }`}
            >
                {collapsed ? (
                    /* Collapsed State: Logo acts as Expand trigger */
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label="Expand sidebar"
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors flex items-center justify-center"
                    >
                        <img
                            src="/images/asura-logo.png"
                            alt="Expand Sidebar"
                            className="h-7 w-7 object-contain"
                        />
                    </button>
                ) : (
                    /* Expanded State: Logo + Text on LEFT, Close Button on RIGHT */
                    <>
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 min-w-0"
                            onClick={onCloseMobile}
                        >
                            <img
                                src="/images/asura-logo.png"
                                alt="AsuraTech Host"
                                className="h-7 w-7 object-contain shrink-0"
                            />
                            <div className="min-w-0 transition-opacity duration-200">
                                <p className="text-sm font-bold text-white truncate leading-tight">
                                    AsuraTech Host
                                </p>
                                <p className="text-[9px] font-bold tracking-wider text-blue-400">
                                    ADMIN PORTAL
                                </p>
                            </div>
                        </Link>

                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                aria-label="Collapse sidebar"
                                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <PanelLeftClose className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={onCloseMobile}
                                className="lg:hidden p-1.5 rounded-md text-slate-400 hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Navigation Body */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
                <Link
                    href={DASHBOARD_LINK.href}
                    title={collapsed ? DASHBOARD_LINK.name : undefined}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                        collapsed ? "justify-center px-2" : "px-3"
                    } ${
                        isLinkActive(DASHBOARD_LINK.href)
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                    <DASHBOARD_LINK.icon className="w-5 h-5 shrink-0" />
                    {isExpanded && <span className="truncate">{DASHBOARD_LINK.name}</span>}
                </Link>

                <div className="pt-2 space-y-1">
                    {ADMIN_NAV_GROUPS.map((group) => {
                        const Icon = group.icon;
                        const isOpen = openGroup === group.name;
                        const isGroupActive = group.children.some((child) =>
                            isLinkActive(child.href)
                        );

                        return (
                            <div key={group.name}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (collapsed) {
                                            onToggleCollapse();
                                        } else {
                                            toggleGroup(group.name);
                                        }
                                    }}
                                    title={collapsed ? group.name : undefined}
                                    className={`flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors ${
                                        collapsed ? "justify-center px-2" : "px-3"
                                    } ${isGroupActive ? "text-blue-400" : "text-slate-300"}`}
                                >
                                    <Icon
                                        className={`w-5 h-5 shrink-0 ${
                                            isGroupActive ? "text-blue-400" : "text-slate-400"
                                        }`}
                                    />
                                    {isExpanded && (
                                        <>
                                            <span className="truncate flex-1 text-left">
                                                {group.name}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                                                    isOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </>
                                    )}
                                </button>

                                {isExpanded && isOpen && (
                                    <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
                                        {group.children.map((child) => {
                                            const childActive = isLinkActive(child.href);
                                            return (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    onClick={onCloseMobile}
                                                    className={`block truncate rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                                        childActive
                                                            ? "text-blue-400 font-semibold bg-slate-800/50"
                                                            : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                                                    }`}
                                                >
                                                    {child.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Footer */}
            <div className="border-t border-slate-800/80 p-2.5">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    title={collapsed ? "Log out" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors ${
                        collapsed ? "justify-center px-2" : "px-3"
                    }`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {isExpanded && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );

    const userContent = (
        <div className="flex h-full flex-col bg-white border-r border-gray-200">
            {/* Header / Brand & Toggle */}
            <div
                className={`flex items-center h-16 shrink-0 px-3.5 border-b border-gray-100 ${
                    collapsed ? "justify-center" : "justify-between"
                }`}
            >
                {collapsed ? (
                    /* Collapsed State: Logo acts as Expand trigger */
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label="Expand sidebar"
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                        <img
                            src="/images/asura-logo.png"
                            alt="Expand Sidebar"
                            className="h-7 w-7 object-contain"
                        />
                    </button>
                ) : (
                    /* Expanded State: Logo + Text on LEFT, Close Button on RIGHT */
                    <>
                        <Link
                            href="/"
                            className="flex items-center gap-2 min-w-0"
                            onClick={onCloseMobile}
                        >
                            <img
                                src="/images/asura-logo.png"
                                alt="AsuraHost Logo"
                                className="w-7 h-7 object-contain shrink-0"
                            />
                            <span className="text-lg font-bold text-slate-900 truncate">
                                Asura<span className="text-blue-600">Host</span>
                            </span>
                        </Link>

                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                aria-label="Collapse sidebar"
                                className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <PanelLeftClose className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={onCloseMobile}
                                className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Navigation Body */}
            <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
                {USER_NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        {isExpanded && (
                            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-1">
                            {group.links.map((link) => {
                                const Icon = link.icon;
                                const isActive = isLinkActive(link.href);

                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={onCloseMobile}
                                        title={collapsed ? link.name : undefined}
                                        className={`flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors ${
                                            collapsed ? "justify-center px-2" : "px-3"
                                        } ${
                                            isActive
                                                ? "bg-blue-50 text-blue-600 font-semibold"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-5 h-5 shrink-0 ${
                                                isActive ? "text-blue-600" : "text-slate-400"
                                            }`}
                                        />
                                        {isExpanded && (
                                            <span className="truncate">{link.name}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Logout Footer */}
            <div className="border-t border-gray-100 p-2.5">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    title={collapsed ? "Log out" : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
                        collapsed ? "justify-center px-2" : "px-3"
                    }`}
                >
                    <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-600" />
                    {isExpanded && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );

    const content = isAdministrator ? adminContent : userContent;

    return (
        <>
            {/* Desktop Persistent Sidebar */}
            <div
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
                    collapsed ? "w-16" : "w-64"
                }`}
            >
                {content}
            </div>

            {/* Mobile Drawer */}
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
                    className={`absolute inset-y-0 left-0 w-64 shadow-xl transition-transform duration-300 ease-in-out ${
                        mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {content}
                </div>
            </div>
        </>
    );
}