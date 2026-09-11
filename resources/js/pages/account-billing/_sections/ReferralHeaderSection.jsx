import { Copy, Mail } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";

const REFERRAL_URL = "https://asuratechhost.app/r/MA...";
const REFERRAL_CODE = "MARIA-HOST";

const STATS = [
    { label: "Friends invited", value: "14" },
    { label: "Now subscribed", value: "6" },
    { label: "Credit earned", value: "₱1,194.00", bold: true },
    { label: "Pending credit", value: "₱398.00", bold: true, highlight: true },
];

export default function ReferralHeaderSection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(REFERRAL_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-start justify-between gap-8">
                {/* Left: title + description + actions */}
                <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-slate-900">
                        Give ₱199, get ₱199
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-sm">
                        Every classmate who subscribes with your link gets their{" "}
                        <span className="text-blue-500">first month free</span>,
                        and you get ₱199 credited against your next invoice.
                        Credit is paid out on Sep 15, 2026.
                    </p>

                    {/* Referral link + actions */}
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-500 font-mono select-all">
                            {REFERRAL_URL}
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-lg gap-1.5"
                            onClick={handleCopy}
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copied ? "Copied!" : "Copy link"}
                        </Button>
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            className="rounded-lg gap-1.5"
                        >
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            Invite by email
                        </Button>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                        Your code:{" "}
                        <span className="font-semibold text-blue-500 tracking-widest">
                            {REFERRAL_CODE}
                        </span>
                    </p>
                </div>

                {/* Right: stats grid */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 shrink-0 text-right">
                    {STATS.map(({ label, value, bold, highlight }) => (
                        <div key={label}>
                            <p className="text-md text-slate-400">{label}</p>
                            <p
                                className={`mt-0.5 ${bold ? "text-md font-bold" : "text-sm font-semibold"} ${highlight ? "text-blue-600" : "text-slate-900"}`}
                            >
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
