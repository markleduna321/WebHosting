import { Clock, CreditCard, QrCode, Wallet } from "lucide-react";
import React, { useRef } from "react";

const GROUP_ICONS = {
    qr: QrCode,
    card: CreditCard,
    ewallet: Wallet,
};

const GROUP_LABELS = {
    qr: "QR payment",
    card: "Cards",
    ewallet: "E-wallets",
};

export default function PaymentMethodSection({
    methods = [],
    value,
    onChange,
    disabled = false,
    errorId,
}) {
    const optionRefs = useRef({});
    const enabledIds = methods.filter((m) => m.enabled).map((m) => m.id);

    const groups = methods.reduce((acc, method) => {
        (acc[method.group] = acc[method.group] || []).push(method);
        return acc;
    }, {});

    // Roving focus: arrow keys move between selectable options only.
    const handleKeyDown = (event, id) => {
        const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
        if (!keys.includes(event.key) || enabledIds.length < 2) return;

        event.preventDefault();
        const step = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
        const index = enabledIds.indexOf(id);
        const nextId =
            enabledIds[(index + step + enabledIds.length) % enabledIds.length];

        onChange(nextId);
        optionRefs.current[nextId]?.focus();
    };

    return (
        <fieldset
            className="mt-5"
            disabled={disabled}
            aria-describedby={errorId}
        >
            <legend id="payment-method-heading" className="text-sm font-bold text-slate-900">
                Payment method
            </legend>

            <div
                role="radiogroup"
                aria-label="Payment method"
                className="mt-3 space-y-4"
            >
                {Object.entries(groups).map(([group, items]) => {
                    const Icon = GROUP_ICONS[group] ?? Wallet;

                    return (
                        <div key={group}>
                            <p className="mb-1.5 text-xs font-medium text-slate-500">
                                {GROUP_LABELS[group] ?? group}
                            </p>

                            <div className="space-y-2">
                                {items.map((method) => {
                                    const selected = value === method.id;
                                    const available = method.enabled;

                                    return (
                                        <button
                                            key={method.id}
                                            ref={(el) => {
                                                optionRefs.current[method.id] = el;
                                            }}
                                            type="button"
                                            role="radio"
                                            aria-checked={selected}
                                            aria-disabled={!available}
                                            tabIndex={available && selected ? 0 : -1}
                                            onClick={() =>
                                                available && onChange(method.id)
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(e, method.id)
                                            }
                                            className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                                !available
                                                    ? "cursor-not-allowed border-gray-200 bg-slate-50 opacity-70"
                                                    : selected
                                                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                                      : "border-gray-200 bg-white hover:border-slate-300"
                                            }`}
                                        >
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                                                    selected && available
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold text-slate-900">
                                                    {method.label}
                                                </span>
                                                <span className="block truncate text-xs text-slate-500">
                                                    {method.description}
                                                </span>
                                            </span>

                                            {available ? (
                                                <span
                                                    aria-hidden="true"
                                                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                                                        selected
                                                            ? "border-blue-600 bg-blue-600 shadow-[inset_0_0_0_2px_white]"
                                                            : "border-slate-300"
                                                    }`}
                                                />
                                            ) : (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                                                    <Clock className="h-3 w-3" />
                                                    Temporarily unavailable
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </fieldset>
    );
}
