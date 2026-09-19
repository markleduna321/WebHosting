import { Link } from "@inertiajs/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    HardDrive,
    Lock,
    Mail,
    RotateCcw,
    Server,
    Shield,
    Trash2,
    Wrench,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { ADD_ONS, formatCurrency } from "../../../../data/hostingPlans";

const ADD_ON_ICONS = {
    "professional-email": Mail,
    "extra-storage": HardDrive,
    "daily-backup": RotateCcw,
    "website-maintenance": Wrench,
    "website-security": Shield,
    "premium-ssl": Lock,
};

function CartItemCard({ icon: Icon, title, badge, caption, price, onRemove, removeLabel }) {
    return (

        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
        >
            <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                    <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                        {title}
                    </p>
                    {badge && (
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300">
                            {badge}
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                        </span>
                    )}
                </div>
                <span className="shrink-0 text-sm font-bold text-blue-400">
                    {price}
                </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">{caption}</p>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label={removeLabel}
                        className="shrink-0 rounded text-slate-500 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default function CheckoutSummarySection({
    plan,
    selectedAddOnIds = [],
    onToggleAddOn,
    onProceed,
}) {
    const [coupon, setCoupon] = useState("");
    const [showCoupon, setShowCoupon] = useState(false);
    const [recommendedOpen, setRecommendedOpen] = useState(true);
    const shouldReduceMotion = useReducedMotion();

    const selectedAddOns = useMemo(
        () => ADD_ONS.filter((addOn) => selectedAddOnIds.includes(addOn.id)),
        [selectedAddOnIds],
    );
    const recommendedAddOns = useMemo(
        () => ADD_ONS.filter((addOn) => !selectedAddOnIds.includes(addOn.id)),
        [selectedAddOnIds],
    );
    const addOnsTotal = useMemo(
        () => selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0),
        [selectedAddOns],
    );
    const hasFixedPrice = plan?.monthlyPrice != null;
    const subtotalDisplay = hasFixedPrice
        ? formatCurrency(plan.monthlyPrice)
        : plan?.price;
    const totalDisplay = hasFixedPrice
        ? formatCurrency(plan.monthlyPrice + addOnsTotal)
        : plan?.price;
    const itemCount = 1 + selectedAddOns.length;

    const tapScale = shouldReduceMotion ? undefined : { scale: 0.95 };

    return (
        <div className="mx-auto w-full max-w-xl border border-slate-800/80 rounded-2xl p-6 bg-slate-900/80">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-white mb-10 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to home
            </Link>

            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white">
                    Your Cart
                </h2>
                <p className="mt-2 text-base text-slate-400">
                    Review your plan before creating your student account.
                </p>
            </div>

            <div className="space-y-6">
                {/* Cart items: plan + any added add-ons */}
                <div className="space-y-3">
                    <CartItemCard
                        icon={Server}
                        title={`${plan?.name ?? ""} Hosting Plan`}
                        badge={hasFixedPrice ? "Monthly" : undefined}
                        caption={
                            hasFixedPrice
                                ? `Renews monthly for ${subtotalDisplay}`
                                : "Custom pricing — our team will confirm details"
                        }
                        price={subtotalDisplay}
                    />

                    <AnimatePresence initial={false}>
                        {selectedAddOns.map((addOn) => (
                            <CartItemCard
                                key={addOn.id}
                                icon={ADD_ON_ICONS[addOn.id] ?? Server}
                                title={addOn.label}
                                caption={`Billed per ${addOn.period}`}
                                price={`${formatCurrency(addOn.price)}/${addOn.period}`}
                                onRemove={() => onToggleAddOn?.(addOn.id)}
                                removeLabel={`Remove ${addOn.label}`}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Recommended add-ons (collapsible) */}
                {recommendedAddOns.length > 0 && (
                    <div>
                        <button
                            type="button"
                            onClick={() => setRecommendedOpen((v) => !v)}
                            aria-expanded={recommendedOpen}
                            className="flex w-full items-center justify-between rounded-xl border border-slate-800 px-4 py-3 text-sm font-semibold text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            Recommended for you
                            <motion.span
                                animate={{ rotate: recommendedOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                            {recommendedOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-3 pt-3">
                                        {recommendedAddOns.map((addOn) => {
                                            const Icon =
                                                ADD_ON_ICONS[addOn.id] ??
                                                Server;
                                            return (
                                                <motion.div
                                                    key={addOn.id}
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                        y: 8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                        marginTop: 0,
                                                    }}
                                                    className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Icon className="h-5 w-5 shrink-0 mt-0.5 text-slate-500" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-white">
                                                                {addOn.label}
                                                            </p>
                                                            <p className="mt-0.5 text-sm font-bold text-blue-400">
                                                                {formatCurrency(
                                                                    addOn.price,
                                                                )}
                                                                /{addOn.period}
                                                            </p>
                                                            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-500">
                                                                {addOn.description?.map(
                                                                    (line) => (
                                                                        <li
                                                                            key={
                                                                                line
                                                                            }
                                                                        >
                                                                            {
                                                                                line
                                                                            }
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <motion.button
                                                            type="button"
                                                            whileTap={tapScale}
                                                            onClick={() =>
                                                                onToggleAddOn?.(
                                                                    addOn.id,
                                                                )
                                                            }
                                                            className="shrink-0 rounded-lg border border-blue-500 px-4 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 transition-colors"
                                                        >
                                                            Get It
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Order Summary */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-bold text-white">
                        Order Summary
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
                        <span className="text-sm font-semibold text-white">
                            Subtotal{" "}
                            <span className="font-normal text-slate-500">
                                (PHP)
                            </span>
                        </span>
                        <span className="text-base font-bold text-blue-400">
                            {totalDisplay}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        Subtotal does not include applicable taxes and fees
                    </p>

                    <div className="mt-3 text-center">
                        {!showCoupon ? (
                            <button
                                type="button"
                                onClick={() => setShowCoupon(true)}
                                className="rounded text-xs font-semibold text-blue-400 underline underline-offset-2 hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                Have a promo code?
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) =>
                                        setCoupon(e.target.value)
                                    }
                                    placeholder="Promo code"
                                    autoFocus
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    className="shrink-0 rounded-lg border border-blue-500 px-4 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    <motion.button
                        type="button"
                        whileHover={
                            shouldReduceMotion ? undefined : { scale: 1.01 }
                        }
                        whileTap={
                            shouldReduceMotion ? undefined : { scale: 0.98 }
                        }
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                        onClick={onProceed}
                        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Ready for Checkout
                    </motion.button>

                    <div className="mt-5 text-center">
                        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                            Quality You Can Trust
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            Our support team is available 24/7 to answer your
                            questions and help you along the way.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


