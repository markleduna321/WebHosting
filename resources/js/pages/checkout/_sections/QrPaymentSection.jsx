import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { CheckCircle2, Clock, RefreshCw, TriangleAlert } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/data/hostingPlans";
import { useGetPaymentQuery } from "@/features/checkout/checkoutApi";

const TERMINAL = ["paid", "failed", "expired"];

/** The QR arrives as a data URL; anything else must not reach an img src. */
function safeImageSrc(url) {
    if (typeof url !== "string") return null;

    return url.startsWith("data:image/") || url.startsWith("https://")
        ? url
        : null;
}

/** Only ever links to PayMongo, so a stray value cannot become a javascript: href. */
function safeTestUrl(url) {
    return typeof url === "string" && url.startsWith("https://") ? url : null;
}

function formatCountdown(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export default function QrPaymentSection({ payment: initialPayment, onRestart }) {
    const [stopped, setStopped] = useState(false);
    const [now, setNow] = useState(() => Date.now());

    const { data: live } = useGetPaymentQuery(initialPayment.uuid, {
        pollingInterval: stopped ? 0 : 4000,
    });

    const payment = live ?? initialPayment;
    const isTerminal = TERMINAL.includes(payment.status);

    useEffect(() => {
        if (isTerminal) setStopped(true);
    }, [isTerminal]);

    useEffect(() => {
        if (isTerminal) return undefined;

        const id = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(id);
    }, [isTerminal]);

    useEffect(() => {
        if (payment.status !== "paid") return undefined;

        // A full visit re-shares auth.user.plan, so the new plan shows everywhere.
        const id = setTimeout(() => router.visit("/dashboard"), 2500);

        return () => clearTimeout(id);
    }, [payment.status]);

    const expiresAt = payment.expires_at
        ? new Date(payment.expires_at).getTime()
        : null;
    const remaining =
        expiresAt !== null ? Math.max(0, Math.floor((expiresAt - now) / 1000)) : null;

    if (payment.status === "paid") {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                    Payment received
                </p>
                <p className="mt-1 text-xs text-slate-600">
                    {formatCurrency(payment.amount)} paid. Your plan is active —
                    taking you to your dashboard.
                </p>
            </div>
        );
    }

    if (payment.status === "failed" || payment.status === "expired") {
        const expired = payment.status === "expired";

        return (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <TriangleAlert className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                    {expired ? "This QR code expired" : "Payment did not go through"}
                </p>
                <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
                    {expired
                        ? "QR codes are valid for a limited time. Generate a new one to try again."
                        : (payment.failure_reason ??
                          "No charge was made. You can try again.")}
                </p>
                <Button
                    variant="primary"
                    size="sm"
                    className="mt-4 rounded-lg"
                    onClick={onRestart}
                >
                    Start over
                </Button>
            </div>
        );
    }

    const qrSrc = safeImageSrc(payment.qr_image_url);

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900">
                    Scan to pay
                </h2>
                <Badge variant="info">
                    <span className="inline-flex items-center gap-1.5">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Waiting for payment
                    </span>
                </Badge>
            </div>

            <p className="mt-1 text-xs text-slate-500">
                Open your bank or e-wallet app, choose QR Ph, and scan this code.
            </p>

            <div className="mt-4 flex justify-center rounded-xl border border-gray-100 bg-slate-50/60 p-4">
                {qrSrc ? (
                    <img
                        src={qrSrc}
                        alt="QR Ph code for this payment"
                        className="h-56 w-56 object-contain"
                    />
                ) : (
                    <div className="flex h-56 w-56 items-center justify-center text-center text-xs text-slate-400">
                        The QR code could not be displayed. Please start over.
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-600">Amount due</span>
                <span className="font-bold text-slate-900">
                    {formatCurrency(payment.amount)}
                </span>
            </div>

            {remaining !== null && (
                <div
                    aria-live="polite"
                    className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                        remaining <= 300
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-50 text-slate-500"
                    }`}
                >
                    <Clock className="h-3.5 w-3.5" />
                    Expires in {formatCountdown(remaining)}
                </div>
            )}

            {/* Stripped from production builds: import.meta.env.DEV is statically false. */}
            {import.meta.env.DEV && safeTestUrl(payment.test_url) && (
                <div className="mt-4 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                        Development only
                    </p>
                    <a
                        href={payment.test_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block w-full rounded-lg bg-amber-100 py-2 text-center text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                        Simulate test payment
                    </a>
                    <p className="mt-2 text-[11px] text-amber-700">
                        Authorise there and PayMongo sends a real webhook — this
                        page updates on its own. Never scan the QR above in test
                        mode; that charges real money.
                    </p>
                </div>
            )}

            <button
                type="button"
                onClick={onRestart}
                className="mt-4 w-full text-center text-xs font-medium text-slate-500 transition-colors hover:text-slate-700 focus:outline-none focus-visible:underline"
            >
                Cancel and choose a different plan
            </button>
        </div>
    );
}
