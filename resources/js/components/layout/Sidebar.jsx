import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, X, PanelLeftClose } from 'lucide-react';
import cn from 'classnames';
import {
    closeMobileSidebar,
    selectMobileSidebarOpen,
    selectSidebarCollapsed,
    toggleSidebar,
} from '@/features/ui/uiSlice';
import { ADMIN_NAV_GROUPS, DASHBOARD_LINK, USER_NAV_GROUPS } from './navConfig';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';

const THEMES = {
    admin: {
        shell: 'bg-slate-900 border-r border-slate-800 text-slate-100',
        headerBorder: 'border-slate-800/80',
        footerBorder: 'border-slate-800/80',
        toggleButton: 'text-slate-400 hover:bg-slate-800 hover:text-white',
        sectionLabel: 'text-slate-500',
        itemActive: 'bg-blue-600 text-white',
        itemIdle: 'text-slate-300 hover:bg-slate-800 hover:text-white',
        iconActive: 'text-white',
        iconIdle: 'text-slate-400',
        groupActive: 'text-blue-400',
        groupIdle: 'text-slate-300',
        groupHover: 'hover:bg-slate-800',
        groupPanelBorder: 'border-slate-800',
        childActive: 'text-blue-400 font-semibold bg-slate-800/50',
        childIdle: 'text-slate-400 hover:text-white hover:bg-slate-800/30',
        logout: 'text-slate-400 hover:bg-slate-800 hover:text-red-400',
        focusRing:
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    },
    user: {
        shell: 'bg-white border-r border-gray-200',
        headerBorder: 'border-gray-100',
        footerBorder: 'border-gray-100',
        toggleButton: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
        sectionLabel: 'text-slate-400',
        itemActive: 'bg-blue-50 text-blue-600 font-semibold',
        itemIdle: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        iconActive: 'text-blue-600',
        iconIdle: 'text-slate-400',
        groupActive: 'text-blue-600',
        groupIdle: 'text-slate-600',
        groupHover: 'hover:bg-slate-50',
        groupPanelBorder: 'border-gray-200',
        childActive: 'text-blue-600 font-semibold bg-blue-50',
        childIdle: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
        logout: 'text-slate-500 hover:bg-red-50 hover:text-red-600',
        focusRing:
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    },
};

function SidebarBrand({ isAdmin, collapsed, theme, onToggleCollapse, onNavigate, onCloseMobile }) {
    if (collapsed) {
        return (
            <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                aria-expanded="false"
                className={cn(
                    'p-1.5 rounded-lg transition-colors flex items-center justify-center',
                    theme.toggleButton,
                    theme.focusRing
                )}
            >
                <img
                    src="/images/asura-logo.png"
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 object-contain"
                />
            </button>
        );
    }

    return (
        <>
            <Link
                href="/"
                onClick={onNavigate}
                className={cn('flex items-center gap-2.5 min-w-0 rounded-lg', theme.focusRing)}
            >
                <img
                    src="/images/asura-logo.png"
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 object-contain shrink-0"
                />
                {isAdmin ? (
                    <span className="min-w-0">
                        <span className="block text-sm font-bold text-white truncate leading-tight">
                            AsuraTech Host
                        </span>
                        <span className="block text-[9px] font-bold tracking-wider text-blue-400">
                            ADMIN PORTAL
                        </span>
                    </span>
                ) : (
                    <span className="text-lg font-bold text-slate-900 truncate">
                        Asura<span className="text-blue-600">Host</span>
                    </span>
                )}
            </Link>

            <div className="flex items-center">
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    aria-label="Collapse sidebar"
                    aria-expanded="true"
                    className={cn(
                        'hidden lg:flex p-1.5 rounded-lg transition-colors',
                        theme.toggleButton,
                        theme.focusRing
                    )}
                >
                    <PanelLeftClose aria-hidden="true" className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={onCloseMobile}
                    aria-label="Close sidebar"
                    className={cn(
                        'lg:hidden p-1.5 rounded-md transition-colors',
                        theme.toggleButton,
                        theme.focusRing
                    )}
                >
                    <X aria-hidden="true" className="w-5 h-5" />
                </button>
            </div>
        </>
    );
}

function SidebarPanel({
    isAdmin,
    collapsed,
    theme,
    idPrefix,
    openGroup,
    onToggleGroup,
    isLinkActive,
    onToggleCollapse,
    onCloseMobile,
}) {
    return (
        <div className={cn('flex h-full flex-col', theme.shell)}>
            <div
                className={cn(
                    'flex items-center h-16 shrink-0 px-3.5 border-b',
                    theme.headerBorder,
                    collapsed ? 'justify-center' : 'justify-between'
                )}
            >
                <SidebarBrand
                    isAdmin={isAdmin}
                    collapsed={collapsed}
                    theme={theme}
                    onToggleCollapse={onToggleCollapse}
                    onNavigate={onCloseMobile}
                    onCloseMobile={onCloseMobile}
                />
            </div>

            <nav
                aria-label="Main"
                className={cn(
                    'flex-1 overflow-y-auto px-2.5 py-4',
                    isAdmin ? 'space-y-1' : 'space-y-6'
                )}
            >
                {isAdmin ? (
                    <>
                        <SidebarNavItem
                            href={DASHBOARD_LINK.href}
                            name={DASHBOARD_LINK.name}
                            icon={DASHBOARD_LINK.icon}
                            collapsed={collapsed}
                            active={isLinkActive(DASHBOARD_LINK.href)}
                            theme={theme}
                            onNavigate={onCloseMobile}
                        />

                        <div className="pt-2 space-y-1">
                            {ADMIN_NAV_GROUPS.map((group) => (
                                <SidebarNavGroup
                                    key={group.name}
                                    group={group}
                                    panelId={`${idPrefix}-${group.name.replace(/\W+/g, '-').toLowerCase()}`}
                                    collapsed={collapsed}
                                    open={openGroup === group.name}
                                    activeGroup={group.children.some((child) =>
                                        isLinkActive(child.href)
                                    )}
                                    isLinkActive={isLinkActive}
                                    theme={theme}
                                    onToggle={() =>
                                        collapsed ? onToggleCollapse() : onToggleGroup(group.name)
                                    }
                                    onNavigate={onCloseMobile}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    USER_NAV_GROUPS.map((group) => (
                        <div key={group.label}>
                            {!collapsed && (
                                <p
                                    className={cn(
                                        'mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider',
                                        theme.sectionLabel
                                    )}
                                >
                                    {group.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.links.map((link) => (
                                    <SidebarNavItem
                                        key={link.name}
                                        href={link.href}
                                        name={link.name}
                                        icon={link.icon}
                                        collapsed={collapsed}
                                        active={isLinkActive(link.href)}
                                        theme={theme}
                                        onNavigate={onCloseMobile}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </nav>

            <div className={cn('border-t p-2.5', theme.footerBorder)}>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    type="button"
                    title={collapsed ? 'Log out' : undefined}
                    aria-label={collapsed ? 'Log out' : undefined}
                    className={cn(
                        'flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
                        theme.logout,
                        theme.focusRing,
                        collapsed ? 'justify-center px-2' : 'px-3'
                    )}
                >
                    <LogOut aria-hidden="true" className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Log out</span>}
                </Link>
            </div>
        </div>
    );
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Sidebar() {
    const dispatch = useDispatch();
    const collapsed = useSelector(selectSidebarCollapsed);
    const mobileOpen = useSelector(selectMobileSidebarOpen);

    const { url, props } = usePage();
    const isAdmin = Boolean(props?.auth?.user?.roles?.includes('admin'));
    const theme = isAdmin ? THEMES.admin : THEMES.user;

    const isLinkActive = (href) => url === href || url.startsWith(`${href}/`);

    const findActiveGroup = () =>
        ADMIN_NAV_GROUPS.find((group) => group.children.some((child) => isLinkActive(child.href)))
            ?.name ?? null;

    const [openGroup, setOpenGroup] = useState(findActiveGroup);
    const drawerRef = useRef(null);
    const lastFocusedRef = useRef(null);

    useEffect(() => {
        const activeGroup = findActiveGroup();
        if (activeGroup) {
            setOpenGroup(activeGroup);
        }
    }, [url]);

    const closeMobile = () => dispatch(closeMobileSidebar());

    // Keeps closed-drawer links out of the tab order without unmounting the slide transition.
    useEffect(() => {
        const node = drawerRef.current;
        if (!node) return;
        if (mobileOpen) {
            node.removeAttribute('inert');
        } else {
            node.setAttribute('inert', '');
        }
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const node = drawerRef.current;
        lastFocusedRef.current = document.activeElement;
        node?.querySelector(FOCUSABLE)?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMobile();
                return;
            }
            if (event.key !== 'Tab' || !node) return;

            const items = Array.from(node.querySelectorAll(FOCUSABLE));
            if (items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            lastFocusedRef.current?.focus?.();
        };
    }, [mobileOpen]);

    const sharedProps = {
        isAdmin,
        theme,
        openGroup,
        onToggleGroup: (name) => setOpenGroup((prev) => (prev === name ? null : name)),
        isLinkActive,
        onToggleCollapse: () => dispatch(toggleSidebar()),
    };

    return (
        <>
            <div
                className={cn(
                    'hidden lg:block fixed inset-y-0 left-0 z-30 transition-[width] duration-300 ease-in-out',
                    collapsed ? 'w-16' : 'w-64'
                )}
            >
                <SidebarPanel
                    {...sharedProps}
                    collapsed={collapsed}
                    idPrefix="sidebar-desktop"
                    onCloseMobile={undefined}
                />
            </div>

            <div
                className={cn(
                    'lg:hidden fixed inset-0 z-40 transition-opacity duration-300',
                    mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
            >
                <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={closeMobile}
                    className="absolute inset-0 h-full w-full cursor-default bg-slate-900/50 backdrop-blur-sm"
                />
                <div
                    ref={drawerRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Sidebar navigation"
                    className={cn(
                        'absolute inset-y-0 left-0 w-[85%] max-w-xs sm:w-72 md:w-80 shadow-xl transition-transform duration-300 ease-in-out',
                        mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    <SidebarPanel
                        {...sharedProps}
                        collapsed={false}
                        idPrefix="sidebar-mobile"
                        onCloseMobile={closeMobile}
                    />
                </div>
            </div>
        </>
    );
}
