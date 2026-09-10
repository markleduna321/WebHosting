import {
    LayoutGrid,
    Users,
    Server,
    CreditCard,
    LifeBuoy,
    Monitor,
    Handshake,
    BarChart3,
    Globe,
    BookOpen,
    Database,
} from 'lucide-react';

export const DASHBOARD_LINK = {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid,
};

export const ADMIN_NAV_GROUPS = [
    {
        name: 'User Management',
        icon: Users,
        children: [
            { name: 'Students', href: '/admin/users/students' },
            { name: 'Admins', href: '/admin/users/admins' },
            { name: 'Roles & Permissions', href: '/admin/users/roles-permissions' },
        ],
    },
    {
        name: 'Hosting Management',
        icon: Server,
        children: [
            { name: 'Hosting Plans', href: '/admin/hosting/plans' },
            { name: 'Websites', href: '/admin/hosting/websites' },
            { name: 'Servers', href: '/admin/hosting/servers' },
            { name: 'Storage', href: '/admin/hosting/storage' },
            { name: 'Bandwidth', href: '/admin/hosting/bandwidth' },
            { name: 'Domains', href: '/admin/hosting/domains' },
            { name: 'SSL Certificates', href: '/admin/hosting/ssl-certificates' },
            { name: 'Databases', href: '/admin/hosting/databases' },
            { name: 'Deployments', href: '/admin/hosting/deployments' },
        ],
    },
    {
        name: 'Subscription & Billing',
        icon: CreditCard,
        children: [
            { name: 'Subscriptions', href: '/admin/billing/subscriptions' },
            { name: 'Payments', href: '/admin/billing/payments' },
            { name: 'Transactions', href: '/admin/billing/transactions' },
            { name: 'Invoices', href: '/admin/billing/invoices' },
            { name: 'Coupons & Discounts', href: '/admin/billing/coupons' },
            { name: 'Refunds', href: '/admin/billing/refunds' },
        ],
    },
    {
        name: 'Support',
        icon: LifeBuoy,
        children: [
            { name: 'Support Tickets', href: '/admin/support/tickets' },
            { name: 'Student Messages', href: '/admin/support/messages' },
            { name: 'Knowledge Base', href: '/admin/support/knowledge-base' },
            { name: 'FAQs', href: '/admin/support/faqs' },
        ],
    },
    {
        name: 'Website Management',
        icon: Monitor,
        children: [
            { name: 'Homepage Content', href: '/admin/website/homepage' },
            { name: 'Hero Section', href: '/admin/website/hero-section' },
            { name: 'Hosting Plans Content', href: '/admin/website/hosting-plans-content' },
            { name: 'Features', href: '/admin/website/features' },
            { name: 'Partners', href: '/admin/website/partners' },
            { name: 'Testimonials', href: '/admin/website/testimonials' },
            { name: 'FAQs', href: '/admin/website/faqs' },
            { name: 'Footer Content', href: '/admin/website/footer' },
        ],
    },
    {
        name: 'Partner Management',
        icon: Handshake,
        children: [
            { name: 'Partners', href: '/admin/partners' },
            { name: 'Partner Logos', href: '/admin/partners/logos' },
            { name: 'Partner Details', href: '/admin/partners/details' },
        ],
    },
    {
        name: 'Reports',
        icon: BarChart3,
        children: [
            { name: 'Revenue Reports', href: '/admin/reports/revenue' },
            { name: 'User Reports', href: '/admin/reports/users' },
            { name: 'Hosting Reports', href: '/admin/reports/hosting' },
            { name: 'Website Reports', href: '/admin/reports/websites' },
            { name: 'Payment Reports', href: '/admin/reports/payments' },
            { name: 'Server Reports', href: '/admin/reports/servers' },
        ],
    },
];

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
