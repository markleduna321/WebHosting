import React, { Fragment, useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
    AlertTriangle,
    Check,
    Copy,
    Download,
    FileSpreadsheet,
    FileText,
    FileType,
    MoreHorizontal,
    Package,
    Pencil,
    Plus,
    Power,
    Search,
    Trash2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import Table from '@/components/ui/Table';
import { formatBillingPeriod, formatCurrency } from '@/data/hostingPlans';
import { useGetAdminPlansQuery } from '@/features/plans/plansApi';
import DeletePlanSection from './DeletePlanSection';
import DisablePlanSection from './DisablePlanSection';
import DuplicatePlanSection from './DuplicatePlanSection';
import EditPlanSection from './EditPlanSection';

const menuItemClass = (active, tone = 'default') =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${
        tone === 'danger'
            ? active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'
            : active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
    }`;

function periodRows(plan) {
    const monthly = plan.monthly_price;

    return Object.entries(plan.billing_periods ?? {})
        .map(([months, total]) => ({ months: Number(months), total: Number(total) }))
        .filter((row) => row.months > 1)
        .sort((a, b) => a.months - b.months)
        .map((row) => {
            const regular = monthly == null ? 0 : monthly * row.months;
            return {
                ...row,
                discountPercent: regular > row.total ? Math.round(((regular - row.total) / regular) * 100) : 0,
            };
        });
}

function LoadingRows() {
    return (
        <div className="p-4" aria-busy="true" aria-label="Loading plans">
            <Skeleton variant="table" lines={4} />
        </div>
    );
}

function EmptyState({ hasSearch, onCreate }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <Package className="h-10 w-10 text-slate-300" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
                {hasSearch ? 'No plans match your search' : 'No plans yet'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
                {hasSearch ? 'Try a different name.' : 'Create a plan to publish it on the pricing page.'}
            </p>
            {!hasSearch && (
                <Button size="sm" className="mt-4" onClick={onCreate}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Create plan
                </Button>
            )}
        </div>
    );
}

export default function HostPlanTableSection({ onCreate }) {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [dialog, setDialog] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const id = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 300);

        return () => clearTimeout(id);
    }, [searchInput]);

    const { data, isLoading, isFetching, isError, refetch } = useGetAdminPlansQuery({ page, search });
    const plans = data?.data ?? [];
    const meta = data?.meta;

    const open = (name, plan) => {
        setSelectedPlan(plan);
        setDialog(name);
    };
    const close = () => setDialog(null);

    const handleExport = (format) => {
        // Placeholder until a real export endpoint exists.
        console.log(`Export hosting plans as ${format}`);
    };

    const columns = [
        {
            header: 'Plan',
            key: 'plan',
            width: 'min-w-[200px]',
            render: (plan) => (
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold text-slate-900">{plan.name}</span>
                        {plan.is_popular && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">Popular</span>
                        )}
                    </div>
                    {plan.subtitle && <p className="mt-0.5 text-xs text-slate-500">{plan.subtitle}</p>}
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">{plan.slug}</p>
                </div>
            ),
        },
        {
            header: 'Monthly',
            key: 'monthly',
            width: 'w-[100px]',
            render: (plan) =>
                plan.monthly_price == null ? (
                    <span className="font-semibold text-slate-900">Custom</span>
                ) : (
                    <span className="font-semibold text-slate-900">
                        {formatCurrency(plan.monthly_price, plan.currency)}
                        <span className="ml-1 text-xs font-normal text-slate-400">/mo</span>
                    </span>
                ),
        },
        {
            header: 'Period prices',
            key: 'periods',
            width: 'min-w-[180px]',
            render: (plan) => {
                const rows = periodRows(plan);

                return (
                    <div className="space-y-1">
                        {plan.has_invalid_pricing && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                                Invalid pricing JSON
                            </span>
                        )}
                        {rows.length === 0 ? (
                            <span className="text-xs text-slate-400">{plan.monthly_price == null ? 'Contact for pricing' : 'Monthly only'}</span>
                        ) : (
                            rows.map((row) => (
                                <div key={row.months} className="text-xs text-slate-600">
                                    <span className="text-slate-400">{formatBillingPeriod(row.months)}</span>{' '}
                                    <span className="font-medium text-slate-800">{formatCurrency(row.total, plan.currency)}</span>
                                    {row.discountPercent > 0 && (
                                        <span className="ml-1 font-medium text-emerald-600">−{row.discountPercent}%</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Storage',
            key: 'storage',
            width: 'w-[90px]',
            render: (plan) => <span className="text-slate-700">{plan.disk_space_mb.toLocaleString()} MB</span>,
        },
        {
            header: 'Databases',
            key: 'databases',
            width: 'w-[110px]',
            render: (plan) => (
                <span className="text-slate-700">
                    {plan.max_databases} × {plan.db_size_mb.toLocaleString()} MB
                </span>
            ),
        },
        {
            header: 'Sites',
            key: 'sites',
            width: 'w-[60px]',
            render: (plan) => <span className="text-slate-700">{plan.max_websites}</span>,
        },
        {
            header: 'Features',
            key: 'features',
            width: 'min-w-[200px]',
            render: (plan) => {
                const features = plan.features ?? [];

                return (
                    <div className="flex flex-wrap gap-1.5">
                        {features.slice(0, 3).map((feature) => (
                            <span key={feature} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                                <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                                {feature}
                            </span>
                        ))}
                        {features.length > 3 && <span className="px-1 py-1 text-[11px] text-slate-400">+{features.length - 3} more</span>}
                        {features.length === 0 && <span className="text-xs text-slate-400">None</span>}
                    </div>
                );
            },
        },
        {
            header: 'Subscribers',
            key: 'subscribers',
            width: 'w-[90px]',
            render: (plan) => <span className="font-semibold text-slate-900">{plan.subscriptions_count ?? 0}</span>,
        },
        {
            header: 'Status',
            key: 'status',
            width: 'w-[100px]',
            render: (plan) =>
                plan.is_active ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                        Inactive
                    </span>
                ),
        },
        {
            header: <span className="sr-only">Actions</span>,
            key: 'actions',
            width: 'w-[40px]',
            render: (plan) => (
                <Menu as="div" className="relative inline-block text-left" onClick={(event) => event.stopPropagation()}>
                    <MenuButton
                        aria-label={`Actions for ${plan.name}`}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </MenuButton>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <MenuItems className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-2xl border border-slate-200 bg-white p-1 shadow-xl focus:outline-none">
                            <MenuItem>
                                {({ active }) => (
                                    <button type="button" onClick={() => open('edit', plan)} className={menuItemClass(active)}>
                                        <Pencil className="h-4 w-4 text-slate-400" />
                                        Edit plan
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button type="button" onClick={() => open('duplicate', plan)} className={menuItemClass(active)}>
                                        <Copy className="h-4 w-4 text-slate-400" />
                                        Duplicate plan
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button type="button" onClick={() => open('toggle', plan)} className={menuItemClass(active, plan.is_active ? 'danger' : 'default')}>
                                        <Power className="h-4 w-4" />
                                        {plan.is_active ? 'Disable plan' : 'Enable plan'}
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button type="button" onClick={() => open('delete', plan)} className={menuItemClass(active, 'danger')}>
                                        <Trash2 className="h-4 w-4" />
                                        Delete plan
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 sm:max-w-[320px]">
                        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="sr-only">Search plans</span>
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search plans..."
                            className="w-full border-0 bg-transparent p-0 outline-none placeholder:text-slate-400 focus:ring-0"
                        />
                    </label>

                    <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                            <Download className="h-4 w-4" />
                            Export
                        </MenuButton>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-2xl border border-slate-200 bg-white p-1 shadow-xl focus:outline-none">
                                {[
                                    ['csv', 'Export as CSV', FileText],
                                    ['excel', 'Export as Excel', FileSpreadsheet],
                                    ['pdf', 'Export as PDF', FileType],
                                ].map(([format, label, Icon]) => (
                                    <MenuItem key={format}>
                                        {({ active }) => (
                                            <button type="button" onClick={() => handleExport(format)} className={menuItemClass(active)}>
                                                <Icon className="h-4 w-4 text-slate-400" />
                                                {label}
                                            </button>
                                        )}
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Transition>
                    </Menu>
                </div>

                {isLoading ? (
                    <LoadingRows />
                ) : isError ? (
                    <div role="alert" className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                        <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
                        <p className="text-sm text-slate-600">The plans could not be loaded.</p>
                        <Button size="sm" variant="light" outlined onClick={refetch}>
                            Try again
                        </Button>
                    </div>
                ) : plans.length === 0 ? (
                    <EmptyState hasSearch={Boolean(search)} onCreate={onCreate} />
                ) : (
                    <div className={`overflow-x-auto transition-opacity ${isFetching ? 'opacity-60' : ''}`} aria-busy={isFetching}>
                        <Table columns={columns} data={plans} />
                    </div>
                )}

                {meta && (
                    <div className="border-t border-slate-200 px-4 py-3">
                        {meta.last_page > 1 ? (
                            <Pagination meta={meta} onPageChange={setPage} />
                        ) : (
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-medium text-slate-700">{meta.total}</span> plan{meta.total === 1 ? '' : 's'}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <EditPlanSection open={dialog === 'edit'} plan={selectedPlan} onCancel={close} onSave={close} />
            <DuplicatePlanSection open={dialog === 'duplicate'} plan={selectedPlan} onCancel={close} onDone={close} />
            <DisablePlanSection open={dialog === 'toggle'} plan={selectedPlan} onCancel={close} onDone={close} />
            <DeletePlanSection open={dialog === 'delete'} plan={selectedPlan} onCancel={close} onDone={close} />
        </div>
    );
}