import React, { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
    TriangleAlert,
    XCircle,
} from "lucide-react";
import { formatCurrency } from "@/data/hostingPlans";
import { useGetPaymentQuery } from "@/features/checkout/checkoutApi";

const TERMINAL = ["paid", "failed", "expired"];
// The webhook usually lands within seconds; stop polling after this so the tab doesn't poll forever.
const MAX_WAIT_MS = 120000;
const PRIMARY_LINK =
    "mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
const SECONDARY_LINK =
    "mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

function StatusCard({ tone, icon: Icon, title, children }) {
    const tones = {
        success: "border-emerald-200 bg-emerald-50/60 text-emerald-600",
        info: "border-gray-200 bg-white text-blue-600",
        warning: "border-gray-200 bg-white text-amber-500",
        danger: "border-gray-200 bg-white text-red-500",
    };

    return (
        <div
            className={`rounded-xl border px-6 py-10 text-center ${tones[tone]}`}
            role="status"
            aria-live="polite"
        >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
                <Icon
                    className={`h-6 w-6 ${tone === "info" ? "animate-spin" : ""}`}
                />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
            <div className="mx-auto mt-1 max-w-sm text-xs text-slate-600">
                {children}
            </div>
        </div>
    );
}

export default function Page({ payment: initialPayment, outcome }) {
    const [timedOut, setTimedOut] = useState(false);
    const watching = outcome === "success" && !timedOut;

    const { data: live } = useGetPaymentQuery(initialPayment.uuid, {
        pollingInterval: watching ? 3000 : 0,
    });

    const payment = live ?? initialPayment;
    const isTerminal = TERMINAL.includes(payment.status);
    const retryHref = payment.plan?.slug ? `/checkout/${payment.plan.slug}` : "/hosting";

    useEffect(() => {
        if (outcome !== "success" || isTerminal) return undefined;
        const id = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
        return () => clearTimeout(id);
    }, [outcome, isTerminal]);

    useEffect(() => {
        if (payment.status !== "paid") return undefined;
        // A full visit re-shares auth.user.plan, so the new plan shows everywhere.
        const id = setTimeout(() => router.visit("/dashboard"), 2500);
        return () => clearTimeout(id);
    }, [payment.status]);

    let content;

    if (payment.status === "paid") {
        content = (
            <StatusCard tone="success" icon={CheckCircle2} title="Payment received">
                {formatCurrency(payment.amount)} paid. Your plan is active — taking
                you to your dashboard.
            </StatusCard>
        );
    } else if (payment.status === "failed" || payment.status === "expired") {
        content = (
            <StatusCard
                tone="danger"
                icon={TriangleAlert}
                title="Payment did not go through"
            >
                <p>
                    {payment.failure_reason ??
                        "No charge was made. You can try again."}
                </p>
                <Link href={retryHref} className={PRIMARY_LINK}>
                    Try again
                </Link>
            </StatusCard>
        );
    } else if (outcome === "cancel") {
        content = (
            <StatusCard tone="warning" icon={XCircle} title="Payment cancelled">
                <p>
                    You left the payment page before finishing. No charge was
                    made.
                </p>
                <Link href={retryHref} className={PRIMARY_LINK}>
                    Back to checkout
                </Link>
            </StatusCard>
        );
    } else if (timedOut) {
        content = (
            <StatusCard
                tone="warning"
                icon={TriangleAlert}
                title="Still confirming your payment"
            >
                <p>
                    PayMongo hasn't confirmed this payment yet. If you were
                    charged, your plan will activate automatically once it does —
                    you don't need to pay again.
                </p>
                <Link href="/dashboard" className={SECONDARY_LINK}>
                    Go to dashboard
                </Link>
            </StatusCard>
        );
    } else {
        content = (
            <StatusCard tone="info" icon={Loader2} title="Confirming your payment…">
                This usually takes a few seconds. Please keep this page open.
            </StatusCard>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans antialiased">
            <Head title="Payment status" />

            <main className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:py-20">
                <Link
                    href="/hosting"
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to plans
                </Link>

                {content}

                <p className="mt-4 text-center text-xs text-slate-400">
                    {payment.plan?.name ? `${payment.plan.name} plan · ` : ""}
                    {formatCurrency(payment.amount)}
                </p>
            </main>
        </div>
    );
}
