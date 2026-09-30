import React from "react";
import { usePage } from "@inertiajs/react";

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });
}

export default function InvoiceSection({ invoice }) {
    const { auth } = usePage().props;

    if (!invoice) return null;

    const currencySymbol = invoice.currency === "PHP" ? "₱" : "$";
    const amount = Number(invoice.amount);
    const formattedAmount = `${currencySymbol} ${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
    })}`;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            {/* Invoice Paper */}
            <div
                id="invoice"
                className="mx-auto w-full max-w-[850px] bg-white px-10 py-12 text-gray-900 shadow-sm"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-200 pb-8">
                    {/* Company */}
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <img
                                src="/images/logo 3.png"
                                alt="CALEHO Solutions"
                                className="h-12 w-12 object-contain"
                            />
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">
                                    CALEHO Solutions
                                </h2>
                                <p className="mt-1 text-[11px] leading-4 text-gray-500">
                                    Lot 39, Garnet St. South Villa 3, Palampas
                                    <br />
                                    San Carlos City, Negros Occidental
                                    <br />
                                    Phone: +63 906-683-0934
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Label */}
                    <div className="text-right">
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                            Invoice
                        </p>
                        <p className="mt-2 text-sm font-medium text-gray-700">
                            {invoice.uuid?.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Invoice Information */}
                <div className="grid grid-cols-2 gap-10 py-8">
                    {/* Bill To */}
                    <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Bill To
                        </p>
                        <p className="text-sm font-medium">
                            {auth?.user?.name ?? "Customer"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            {auth?.user?.email}
                        </p>
                    </div>

                    {/* Dates */}
                    <div className="text-right">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Issue Date
                        </p>
                        <p className="text-sm font-medium">
                            {formatDate(invoice.created_at)}
                        </p>

                        {invoice.paid_at && (
                            <>
                                <p className="mt-4 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                                    Paid Date
                                </p>
                                <p className="text-sm font-medium">
                                    {formatDate(invoice.paid_at)}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_130px_130px] border-y border-gray-200 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                        <span>Description</span>
                        <span className="text-right">Price</span>
                        <span className="text-right">Amount</span>
                    </div>

                    {/* Item */}
                    <div className="grid grid-cols-[1fr_130px_130px] border-b border-gray-100 py-5 text-sm">
                        <div>
                            <span className="text-gray-700 font-medium">
                                {invoice.plan?.name ?? "Hosting Plan"}
                            </span>
                            <span className="ml-2 text-xs text-gray-400 capitalize">
                                ({invoice.billing_cycle})
                            </span>
                            {invoice.plan?.features && invoice.plan.features.length > 0 && (
                                <ul className="mt-2 space-y-1 text-xs text-gray-500 list-disc list-inside">
                                    {invoice.plan.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <span className="text-right text-gray-600">
                            {formattedAmount}
                        </span>

                        <span className="text-right font-medium">
                            {formattedAmount}
                        </span>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end py-8">
                    <div className="w-[260px]">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <span className="text-xs text-gray-500">
                                Subtotal
                            </span>
                            <span className="text-sm">{formattedAmount}</span>
                        </div>

                        <div className="flex items-center justify-between pt-5">
                            <span className="text-sm font-semibold">Total</span>
                            <span className="text-xl font-semibold tracking-tight">
                                {formattedAmount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="grid grid-cols-2 gap-10 border-t border-gray-200 pt-8">
                    <div>
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Payment Status
                        </p>
                        <div className="space-y-2 text-xs">
                            <div className="flex gap-4">
                                <span className="w-24 text-gray-400">
                                    Status
                                </span>
                                <span
                                    className={`font-medium ${
                                        invoice.status === "paid"
                                            ? "text-green-600"
                                            : invoice.status === "failed"
                                            ? "text-red-500"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {invoice.status?.charAt(0).toUpperCase() +
                                        invoice.status?.slice(1)}
                                </span>
                            </div>
                            {invoice.failure_reason && (
                                <div className="flex gap-4">
                                    <span className="w-24 text-gray-400">
                                        Reason
                                    </span>
                                    <span className="font-medium text-red-500">
                                        {invoice.failure_reason}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thank You */}
                    <div className="text-right">
                        <p className="text-xs leading-5 text-gray-500">
                            Thank you for choosing
                            <br />
                            <span className="font-medium text-gray-700">
                                CALEHO Solutions.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 border-t border-gray-200 pt-5 text-center">
                    <p className="text-[10px] text-gray-400">
                        If you have any questions, please contact us at
                        <span className="ml-1 text-gray-500">
                            calehosolutions.com
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}