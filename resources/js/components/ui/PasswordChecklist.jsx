import { Check, X } from "lucide-react";
import React from "react";
import { evaluatePassword, getStrength } from "../../utils/passwordRules";

const SEGMENTS = [0, 1, 2, 3];

export default function PasswordChecklist({
    password = "",
    visible = false,
    className = "",
}) {
    const { results, passedCount } = evaluatePassword(password);
    const strength = getStrength(passedCount);

    return (
        <div
            className={`overflow-hidden transition-all duration-200 ${
                visible
                    ? "mt-3 max-h-72 opacity-100"
                    : "max-h-0 opacity-0"
            } ${className}`}
            aria-hidden={!visible}
        >
            <div role="status" aria-live="polite">
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                        {SEGMENTS.map((segment) => (
                            <span
                                key={segment}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    password && segment < strength.filledSegments
                                        ? strength.barClass
                                        : "bg-slate-200"
                                }`}
                            />
                        ))}
                    </div>
                    <span
                        className={`text-xs font-medium ${
                            password ? strength.textClass : "text-slate-400"
                        }`}
                    >
                        {password ? strength.label : "—"}
                    </span>
                </div>

                <ul className="mt-2.5 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                    {results.map((rule) => (
                        <li
                            key={rule.key}
                            className={`flex items-center gap-1.5 text-xs ${
                                rule.passed ? "text-emerald-600" : "text-slate-500"
                            }`}
                        >
                            {rule.passed ? (
                                <Check className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                                <X className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            )}
                            <span>{rule.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
