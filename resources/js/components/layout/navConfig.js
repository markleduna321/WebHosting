import {
    LayoutGrid,
    Users,
    Server,
    CreditCard,
    BarChart3,
    Database,
    Globe,
    BookOpen,
} from 'lucide-react';

export const DASHBOARD_LINK = {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
    description: 'VPS health and financial KPIs',
};

export const ADMIN_NAV_GROUPS = [
    {
        name: 'Plans',
        href: '/hosting',
        icon: Server,
        description: 'Pricing, caps and feature flags',
    },
    {
        name: 'User Management',
        href: '/admin/user-management',
        icon: Users,
        description: 'Global directory of all users',
    },
    {
        name: 'Tenant & License Manager',
        href: '/admin/permissions',
        icon: CreditCard,
        description: 'School contracts and seat quotas',
    },
    {
        name: 'Global RBAC & Audit Logs',
        href: '/admin/permissions?view=audit-logs',
        icon: Database,
        description: 'Permissions matrix and system trail',
    },
    {
        name: 'Reports (Analytics)',
        href: '/admin/roles?view=reports',
        icon: BarChart3,
        description: 'Growth, referrals, storage and churn',
    },
];

const ADMIN_HEADER_META = {
    '/dashboard': {
        breadcrumb: 'Dashboard',
        title: 'Dashboard',
        subtitle:
            'Server infrastructure metrics for Hostinger KVM 4 (srv-asuratech-01) alongside the financial KPIs that matter this month.',
        actionLabel: null,
        actionSecondaryLabel: null,
    },
    '/hosting': {
        breadcrumb: 'Plans',
        title: 'Plans',
        subtitle:
            'Dynamic plan configuration — set price points, storage caps, database limits and feature flags without touching backend code. Active plans publish straight to the public pricing carousel.',
        actionLabel: 'Create plan',
        actionSecondaryLabel: null,
    },
    '/admin/roles': {
        breadcrumb: 'User Management',
        title: 'Roles',
        subtitle: 'Create roles and assign permissions.',
        actionLabel: 'Create role',
        actionSecondaryLabel: null,
    },
    '/admin/user-management': {
        breadcrumb: 'User Management',
        title: 'User management',
        subtitle:
            'Global directory of every registered student and standard user — suspend accounts, override resource quotas, or reset credentials.',
        actionLabel: 'Invite student',
        actionSecondaryLabel: null,
    },
    '/admin/permissions': {
        breadcrumb: 'Tenant & License Manager',
        title: 'Tenant & license manager',
        subtitle:
            'Institutional contracts for future school partnerships — assign bulk seat quotas, set per-seat storage caps, and issue school-level access keys.',
        actionLabel: 'New tenant',
        actionSecondaryLabel: null,
    },
    '/admin/permissions?view=audit-logs': {
        breadcrumb: 'Global RBAC & Audit Logs',
        title: 'Global RBAC & audit logs',
        subtitle:
            'The permissions matrix for Super Admin, Admin and Student roles, plus the system trail of VPS commands, account creations and webhook events.',
        actionLabel: 'Create custom role',
        actionSecondaryLabel: null,
    },
    '/admin/roles?view=reports': {
        breadcrumb: 'Reports (Analytics)',
        title: 'Reports',
        subtitle:
            'Business growth intelligence — MRR trends, referral conversion, storage consumption and churn, read together.',
        actionLabel: '12 months',
        actionSecondaryLabel: '6 months',
    },
};

export function getAdminHeaderMeta(href) {
    return ADMIN_HEADER_META[href] ?? ADMIN_HEADER_META['/dashboard'];
}

export const USER_NAV_GROUPS = [
    {
        label: 'Workspace',
        links: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { name: 'Sites & Domains', href: '/site-domain', icon: Globe },
            { name: 'Files & Database', href: '/files-database', icon: Database },
            { name: 'Account & Billing', href: '/account-billing', icon: CreditCard },
        ],
    },
    {
        label: 'More',
        links: [
            { name: 'Hosting Plan', href: '/hosting', icon: Server },
            { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
        ],
    },
];
