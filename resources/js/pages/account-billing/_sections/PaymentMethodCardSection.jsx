import { ShieldCheck } from "lucide-react";
import React from "react";

const BILLING_INFO = [
    { label: "Billing currency", value: "PHP (₱)" },
    { label: "Next charge", value: "Sep 1, 2026" },
    { label: "Retry policy", value: "3 attempts over 5 days" },
];

export default function PaymentMethodCardSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Shield icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 mb-4">
                <ShieldCheck className="w-5 h-5" />
            </div>

            {/* Title + description */}
            <p className="text-sm font-bold text-slate-900">
                Processed by PayMongo
            </p>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Payments are processed securely by PayMongo using QR Ph, which
                works with any bank or e-wallet app. Visa/Mastercard, GCash,
                Maya, and GrabPay are coming soon. Card details will never
                touch AsuraTech Host servers, and every charge is receipted to
                your student email.
            </p>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Billing info rows */}
            <div className="space-y-3">
                {BILLING_INFO.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-blue-400">{label}</span>
                        <span className="text-xs font-semibold text-slate-800">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
