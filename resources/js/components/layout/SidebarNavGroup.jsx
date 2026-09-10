import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import cn from 'classnames';

export default function SidebarNavGroup({
    group,
    panelId,
    collapsed = false,
    open = false,
    activeGroup = false,
    isLinkActive,
    theme,
    onToggle,
    onNavigate,
}) {
    const Icon = group.icon;
    const isOpen = !collapsed && open;

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                title={collapsed ? group.name : undefined}
                aria-label={collapsed ? group.name : undefined}
                aria-expanded={collapsed ? undefined : open}
                aria-controls={collapsed ? undefined : panelId}
                className={cn(
                    'flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors',
                    theme.groupHover,
                    theme.focusRing,
                    collapsed ? 'justify-center px-2' : 'px-3',
                    activeGroup ? theme.groupActive : theme.groupIdle
                )}
            >
                <Icon
                    aria-hidden="true"
                    className={cn(
                        'w-5 h-5 shrink-0',
                        activeGroup ? theme.iconActive : theme.iconIdle
                    )}
                />
                {!collapsed && (
                    <>
                        <span className="truncate flex-1 text-left">{group.name}</span>
                        <ChevronDown
                            aria-hidden="true"
                            className={cn(
                                'w-4 h-4 shrink-0 transition-transform duration-200',
                                theme.iconIdle,
                                open && 'rotate-180'
                            )}
                        />
                    </>
                )}
            </button>

            {isOpen && (
                <div
                    id={panelId}
                    className={cn('mt-1 ml-4 pl-3 border-l space-y-1', theme.groupPanelBorder)}
                >
                    {group.children.map((child) => {
                        const childActive = isLinkActive(child.href);
                        return (
                            <Link
                                key={child.name}
                                href={child.href}
                                onClick={onNavigate}
                                aria-current={childActive ? 'page' : undefined}
                                className={cn(
                                    'block truncate rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                                    theme.focusRing,
                                    childActive ? theme.childActive : theme.childIdle
                                )}
                            >
                                {child.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
