import React, { useMemo, useState } from 'react';
import { Download, Search, MoreHorizontal, Check, Pencil, Copy, Power, Trash2, FileText, FileSpreadsheet, FileType } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Table from '@/components/ui/Table';
import { formatCurrency } from '../../../data/hostingPlans';
import EditPlanSection from './EditPlanSection';
import DeletePlanSection from './DeletePlanSection';
import DisablePlanSection from './DisablePlanSection';
import DuplicatePlanSection from './DuplicatePlanSection';

const FEATURE_LABELS = ['SSL', 'Git', 'Deploys'];

function getPlanPrice(plan) {
    return plan.monthlyPrice ?? null;
}

function getAnnualPrice(plan) {
    return plan.prices?.[12] ?? null;
}

function getPlanSubtitle(plan) {
    return plan.subtitle ?? plan.description ?? '';
}

function getPlanFeatures(plan) {
    const features = plan.features ?? [];
    if (Array.isArray(features) && features.length > 0) {
        return features.slice(0, 3);
    }

    return FEATURE_LABELS;
}

function formatStorageCap(plan) {
    if (getPlanPrice(plan) === null) {
        return 'Unlimited';
    }

    const caps = {
        Student: '5,120 MB',
        Pro: '15,360 MB',
        Enterprise: 'Unlimited',
    };

    return caps[plan.name] ?? 'Unlimited';
}

function buildRows(plans) {
    return plans.map((plan, index) => ({
        id: plan.slug ?? plan.name,
        plan,
        monthly: getPlanPrice(plan) === null ? 'Custom' : formatCurrency(getPlanPrice(plan)),
        yearly:
            getAnnualPrice(plan) === null
                ? 'Contact for pricing'
                : formatCurrency(getAnnualPrice(plan)),
        storageCap: formatStorageCap(plan),
        databases: getPlanPrice(plan) === null ? 'Unlimited' : String([1, 2, 5, 10][index] ?? 10),
        subscribers: 2,
        status: 'Active',
        popular: Boolean(plan.popular),
        features: getPlanFeatures(plan),
    }));
}

export default function HostPlanTableSection({ plans = [] }) {
    const [search, setSearch] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDisable, setOpenDisable] = useState(false);
    const [openDuplicate, setOpenDuplicate] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const rows = useMemo(() => buildRows(plans), [plans]);

    const filteredRows = rows.filter((row) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return (
            row.plan.name.toLowerCase().includes(query) ||
            row.plan.subtitle.toLowerCase().includes(query)
        );
    });

    const handleExport = (format) => {
        // Placeholder until a real export endpoint exists.
        console.log(`Export hosting plans as ${format}`);
    };

    const columns = [
        {
            header: 'Plan',
            key: 'plan',
            width: 'min-w-[240px]',
            render: (row) => (
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-slate-900">{row.plan.name}</span>
                        {row.popular && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                Popular
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{row.plan.subtitle}</p>
                </div>
            ),
        },
        {
            header: 'Monthly',
            key: 'monthly',
            width: 'w-[90px]',
            render: (row) => (
                <div className="font-semibold text-slate-900">
                    {row.monthly}
                    {getPlanPrice(row.plan) !== null && (
                        <span className="ml-1 text-xs font-normal text-slate-400">/mo</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Yearly',
            key: 'yearly',
            width: 'w-[100px]',
            render: (row) => <span className="text-slate-700">{row.yearly}</span>,
        },
        {
            header: 'Storage cap',
            key: 'storageCap',
            width: 'w-[120px]',
            render: (row) => <span className="text-slate-700">{row.storageCap}</span>,
        },
        {
            header: 'Databases',
            key: 'databases',
            width: 'w-[90px]',
            render: (row) => <span className="text-slate-700">{row.databases}</span>,
        },
        {
            header: 'Feature flags',
            key: 'features',
            width: 'min-w-[220px]',
            render: (row) => (
                <div className="flex flex-wrap gap-1.5">
                    {row.features.map((feature) => (
                        <span
                            key={feature}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500"
                        >
                            <Check className="h-3 w-3 text-emerald-500" />
                            {feature}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            header: 'Subscribers',
            key: 'subscribers',
            width: 'w-[100px]',
            render: (row) => <span className="font-semibold text-slate-900">{row.subscribers}</span>,
        },
        {
            header: 'Status',
            key: 'status',
            width: 'w-[100px]',
            render: () => (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                </span>
            ),
        },
        {
            header: '',
            key: 'actions',
            width: 'w-[40px]',
            render: (row) => (
                <Menu as="div" className="relative inline-block text-left">
                    <MenuButton className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
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
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPlan(row.plan);
                                            setOpenEdit(true);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                    >
                                        <Pencil className="h-4 w-4 text-slate-400" />
                                        Edit plan
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPlan(row.plan);
                                            setOpenDuplicate(true);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                    >
                                        <Copy className="h-4 w-4 text-slate-400" />
                                        Duplicate plan
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPlan(row.plan);
                                            setOpenDisable(true);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'}`}
                                    >
                                        <Power className="h-4 w-4" />
                                        Disable plan
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPlan(row.plan);
                                            setOpenDelete(true);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'}`}
                                    >
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
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <label className="flex h-11 w-full max-w-[320px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
                    <Search className="h-4 w-4 shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search plans..."
                        className="w-full bg-transparent outline-none placeholder:text-slate-400"
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
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleExport('csv')}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                    >
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        Export as CSV
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleExport('excel')}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                    >
                                        <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                                        Export as Excel
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => handleExport('pdf')}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                                    >
                                        <FileType className="h-4 w-4 text-slate-400" />
                                        Export as PDF
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
                <div className="overflow-x-auto">
                    <Table columns={columns} data={filteredRows} />
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Showing <span className="font-medium text-slate-700">{filteredRows.length}</span> of{' '}
                        <span className="font-medium text-slate-700">{rows.length}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">
                            <span className="text-lg leading-none">‹</span>
                        </button>
                        <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm">
                            1
                        </button>
                        <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">
                            <span className="text-lg leading-none">›</span>
                        </button>
                    </div>
                </div>
            </div>

            <EditPlanSection open={openEdit} plan={selectedPlan} onCancel={() => setOpenEdit(false)} onSave={() => setOpenEdit(false)} />
            <DuplicatePlanSection open={openDuplicate} plan={selectedPlan} onCancel={() => setOpenDuplicate(false)} onDuplicate={() => setOpenDuplicate(false)} />
            <DisablePlanSection open={openDisable} plan={selectedPlan} onCancel={() => setOpenDisable(false)} onDisable={() => setOpenDisable(false)} />
            <DeletePlanSection open={openDelete} plan={selectedPlan} onCancel={() => setOpenDelete(false)} onDelete={() => setOpenDelete(false)} />
        </div>
    );
}
