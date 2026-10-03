import React from "react";
import { usePage } from "@inertiajs/react";
import { Download } from "lucide-react";

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
    const money = (value) =>
        `${currencySymbol} ${Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    const details = invoice.invoice;
    const items = details?.items ?? [
        {
            description: invoice.plan?.name ?? "Hosting Plan",
            detail: invoice.billing_cycle,
            quantity: 1,
            unit_amount: invoice.amount,
            amount: invoice.amount,
        },
    ];
    const tax = details?.tax;
    const invoiceLabel =
        invoice.invoice_number ?? invoice.uuid?.substring(0, 8).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-2 sm:py-10 sm:px-4">
            {details?.download_url && (
                <div className="mx-auto mb-4 flex w-full max-w-[850px] justify-end">
                    <a
                        href={details.download_url}
                        download
                        aria-label={`Download invoice ${invoiceLabel} as PDF`}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        <Download className="h-4 w-4" />
                        Download PDF
                    </a>
                </div>
            )}

            {/* Invoice Paper */}
            <div
                id="invoice"
                className="mx-auto w-full max-w-[850px] bg-white px-5 py-8 text-gray-900 shadow-sm sm:px-10 sm:py-12"
            >
                {/* Header */}
                <div className="flex flex-col gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
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
                    <div className="sm:text-right">
                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                            Invoice
                        </p>
                        <p className="mt-2 text-sm font-medium text-gray-700">
                            {invoiceLabel}
                        </p>
                    </div>
                </div>

                {/* Invoice Information */}
                <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 sm:gap-10">
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
                    <div className="sm:text-right">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Issue Date
                        </p>
                        <p className="text-sm font-medium">
                            {formatDate(details?.issued_at ?? invoice.created_at)}
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
                <div className="overflow-x-auto">
                    <div className="min-w-[480px]">
                        <div className="grid grid-cols-[1fr_50px_110px_110px] border-y border-gray-200 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                            <span>Description</span>
                            <span className="text-right">Qty</span>
                            <span className="text-right">Unit price</span>
                            <span className="text-right">Amount</span>
                        </div>

                        {items.map((item, i) => (
                            <div
                                key={`${item.description}-${i}`}
                                className="grid grid-cols-[1fr_50px_110px_110px] border-b border-gray-100 py-4 text-sm"
                            >
                                <div>
                                    <span className="font-medium text-gray-700">
                                        {item.description}
                                    </span>
                                    {item.detail && (
                                        <span className="block text-xs capitalize text-gray-400">
                                            {item.detail}
                                        </span>
                                    )}
                                </div>
                                <span className="text-right text-gray-600">
                                    {item.quantity}
                                </span>
                                <span className="text-right text-gray-600">
                                    {money(item.unit_amount)}
                                </span>
                                <span className="text-right font-medium">
                                    {money(item.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end py-8">
                    <div className="w-full sm:w-[300px]">
                        <div className="flex items-center justify-between pb-3">
                            <span className="text-xs text-gray-500">
                                Subtotal
                            </span>
                            <span className="text-sm">
                                {money(details?.subtotal ?? invoice.amount)}
                            </span>
                        </div>

                        {tax?.mode === "vat" && (
                            <>
                                <div className="flex items-center justify-between pb-3">
                                    <span className="text-xs text-gray-500">
                                        Vatable sales
                                    </span>
                                    <span className="text-sm">
                                        {money(tax.vatable_sales)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pb-3">
                                    <span className="text-xs text-gray-500">
                                        VAT ({Math.round(tax.rate * 100)}%, included)
                                    </span>
                                    <span className="text-sm">
                                        {money(tax.vat_amount)}
                                    </span>
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-between border-t border-gray-200 pt-5">
                            <span className="text-sm font-semibold">Total</span>
                            <span className="text-xl font-semibold tracking-tight">
                                {money(details?.total ?? invoice.amount)}
                            </span>
                        </div>

                        {tax?.mode === "non_vat" && (
                            <p className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-[11px] leading-4 text-gray-500">
                                {tax.note}
                            </p>
                        )}
                    </div>
                </div>

                {/* Payment Status */}
                <div className="grid grid-cols-1 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-2 sm:gap-10">
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
                            {details?.payment_method && (
                                <div className="flex gap-4">
                                    <span className="w-24 text-gray-400">
                                        Paid via
                                    </span>
                                    <span className="font-medium text-gray-700">
                                        {details.payment_method}
                                    </span>
                                </div>
                            )}
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
                    <div className="sm:text-right">
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