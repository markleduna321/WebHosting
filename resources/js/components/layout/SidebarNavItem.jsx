import { Link } from '@inertiajs/react';
import cn from 'classnames';

export default function SidebarNavItem({
    href,
    name,
    icon: Icon,
    collapsed = false,
    active = false,
    theme,
    onNavigate,
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            title={collapsed ? name : undefined}
            aria-current={active ? 'page' : undefined}
            aria-label={collapsed ? name : undefined}
            className={cn(
                'flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors',
                theme.focusRing,
                collapsed ? 'justify-center px-2' : 'px-3',
                active ? theme.itemActive : theme.itemIdle
            )}
        >
            {Icon && (
                <Icon
                    aria-hidden="true"
                    className={cn(
                        'w-5 h-5 shrink-0',
                        active ? theme.iconActive : theme.iconIdle
                    )}
                />
            )}
            {!collapsed && <span className="truncate">{name}</span>}
        </Link>
    );
}
