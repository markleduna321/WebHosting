import { Wallet, CreditCard, Trash2, Plus } from "lucide-react";
import React from "react";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";

const METHODS = [
    {
        id: 1,
        name: "GCash ●●●● 4821",
        meta: "E-wallet · Maria Clara S.",
        type: "ewallet",
        isDefault: true,
    },
    {
        id: 2,
        name: "Visa ●●●● 0294",
        meta: "Card · Expires 08/29",
        type: "card",
        isDefault: false,
    },
    {
        id: 3,
        name: "Maya ●●●● 7710",
        meta: "E-wallet · Maria Clara S.",
        type: "ewallet",
        isDefault: false,
    },
];

const COLUMNS = [
    {
        header: "",
        accessor: "name",
        render: (row) => (
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                    {row.type === "card" ? (
                        <CreditCard className="w-4 h-4" />
                    ) : (
                        <Wallet className="w-4 h-4" />
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {row.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{row.meta}</p>
                </div>
            </div>
        ),
    },
    {
        header: "",
        accessor: "actions",
        render: (row) => (
            <div className="flex items-center justify-end gap-3">
                {row.isDefault ? (
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                        Default
                    </span>
                ) : (
                    <Button
                        variant="light"
                        size="xs"
                        outlined
                        className="rounded-full"
                    >
                        Make default
                    </Button>
                )}
                <button
                    aria-label="Remove payment method"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ),
    },
];

export default function PaymentMethodTableSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Payment methods
                    </h2>
                    <p className="text-xs mt-0.5">
                        <span className="text-slate-500">Your </span>
                        <span className="text-blue-500">default</span>
                        <span className="text-slate-500"> method is charged on the </span>
                        <span className="text-blue-500">1st</span>
                        <span className="text-slate-500"> of each month.</span>
                    </p>
                </div>
                <Button
                    variant="light"
                    size="sm"
                    outlined
                    className="rounded-xl gap-1.5 shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add method
                </Button>
            </div>

            <Table columns={COLUMNS} data={METHODS} />
        </div>
    );
}
