import React from "react";
import Table from "@/components/ui/Table";

const REFERRALS = [
    { id: 1, name: "Jomar R.", joined: "Joined Aug 27, 2026", status: "subscribed", credit: "₱199.00" },
    { id: 2, name: "Alyssa P.", joined: "Joined Aug 21, 2026", status: "subscribed", credit: "₱199.00" },
    { id: 3, name: "Bea T.", joined: "Joined Aug 14, 2026", status: "pending", credit: "₱199.00" },
    { id: 4, name: "Karl D.", joined: "Joined Aug 9, 2026", status: "signedup", credit: null },
    { id: 5, name: "Nica V.", joined: "Joined Jul 30, 2026", status: "subscribed", credit: "₱199.00" },
];

const STATUS_STYLES = {
    subscribed: "text-green-600 bg-green-50 border border-green-200",
    pending: "text-slate-600 bg-white border border-slate-200",
    signedup: "text-slate-600 bg-white border border-slate-200",
};

const STATUS_LABELS = {
    subscribed: "Subscribed",
    pending: "Pending",
    signedup: "Signed up",
};

const COLUMNS = [
    {
        header: "",
        accessor: "name",
        render: (row) => (
            <div>
                <p className="text-sm font-semibold text-slate-900">{row.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{row.joined}</p>
            </div>
        ),
    },
    {
        header: "",
        accessor: "status",
        render: (row) => (
            <div className="flex items-center justify-end gap-6">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                    {STATUS_LABELS[row.status]}
                </span>
                <span className="text-sm font-semibold text-slate-900 w-16 text-right">
                    {row.credit ?? "—"}
                </span>
            </div>
        ),
    },
];

export default function ReferralTableSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Referral activity
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Credit clears once a friend pays their first invoice
                </p>
            </div>

            <Table columns={COLUMNS} data={REFERRALS} />
        </div>
    );
}
