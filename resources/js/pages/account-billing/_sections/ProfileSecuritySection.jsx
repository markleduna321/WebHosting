import React, { useState, useRef, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ShieldCheck, ShieldOff, Mail, Loader2 } from "lucide-react";
import {
    useEnableTwoFactorMutation,
    useVerifyTwoFactorMutation,
    useDisableTwoFactorMutation,
    useResendTwoFactorMutation,
} from "@/features/two-factor/twoFactorApi";

export default function ProfileSecuritySection() {
    const { twoFactor, auth } = usePage().props;

    const isEnabled = twoFactor?.enabled ?? false;

    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef([]);

    const [enableTwoFactor, { isLoading: isEnabling }] = useEnableTwoFactorMutation();
    const [verifyTwoFactor, { isLoading: isVerifying }] = useVerifyTwoFactorMutation();
    const [disableTwoFactor, { isLoading: isDisabling }] = useDisableTwoFactorMutation();
    const [resendTwoFactor, { isLoading: isResending }] = useResendTwoFactorMutation();

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    // Auto-focus first input when modal opens
    useEffect(() => {
        if (showVerifyModal) {
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [showVerifyModal]);

    const handleEnable = async () => {
        setError(null);
        setSuccess(null);
        try {
            await enableTwoFactor().unwrap();
            setShowVerifyModal(true);
            setResendCooldown(60);
        } catch (err) {
            setError(err?.data?.message || "Failed to start 2FA setup.");
        }
    };

    const handleVerify = async () => {
        const codeStr = code.join("");
        if (codeStr.length !== 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }

        setError(null);
        try {
            await verifyTwoFactor({ code: codeStr }).unwrap();
            setShowVerifyModal(false);
            setCode(["", "", "", "", "", ""]);
            setSuccess("Two-factor authentication enabled successfully!");
            // Reload to get updated twoFactor prop
            router.reload({ only: ["twoFactor"] });
        } catch (err) {
            setError(err?.data?.message || "Invalid code. Please try again.");
        }
    };

    const handleDisable = async () => {
        setError(null);
        try {
            await disableTwoFactor().unwrap();
            setShowDisableConfirm(false);
            setSuccess("Two-factor authentication has been disabled.");
            router.reload({ only: ["twoFactor"] });
        } catch (err) {
            setError(err?.data?.message || "Failed to disable 2FA.");
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setError(null);
        try {
            await resendTwoFactor().unwrap();
            setResendCooldown(60);
        } catch (err) {
            setError(err?.data?.message || "Failed to resend code.");
        }
    };

    // OTP input handlers
    const handleCodeChange = (index, value) => {
        // Only allow digits
        const digit = value.replace(/\D/g, "").slice(-1);
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        // Auto-advance to next input
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length > 0) {
            const newCode = [...code];
            for (let i = 0; i < 6; i++) {
                newCode[i] = pasted[i] || "";
            }
            setCode(newCode);
            // Focus the last filled input
            const lastIdx = Math.min(pasted.length, 5);
            inputRefs.current[lastIdx]?.focus();
            e.preventDefault();
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
                <h2 className="text-sm font-bold text-slate-900">Security</h2>

                {success && (
                    <div className="mt-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                        {success}
                    </div>
                )}

                {error && !showVerifyModal && (
                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                        {error}
                    </div>
                )}

                {isEnabled ? (
                    <>
                        <div className="mt-3 flex items-center gap-2 text-green-600">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-medium">
                                Two-factor authentication is enabled
                            </span>
                        </div>
                        {twoFactor?.verified_at && (
                            <p className="mt-1 text-[11px] text-slate-400">
                                Enabled on{" "}
                                {new Date(twoFactor.verified_at).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                        )}
                        <div className="mt-3">
                            <Button
                                variant="light"
                                size="sm"
                                outlined
                                className="rounded-lg text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => setShowDisableConfirm(true)}
                                disabled={isDisabling}
                            >
                                <ShieldOff className="w-3.5 h-3.5 mr-1.5" />
                                Disable 2FA
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Two-factor authentication adds an extra layer of
                            security. We'll send a verification code to your
                            email each time you need to verify.
                        </p>
                        <div className="mt-3">
                            <Button
                                variant="primary"
                                size="sm"
                                className="rounded-lg"
                                onClick={handleEnable}
                                disabled={isEnabling}
                            >
                                {isEnabling ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                        Sending code…
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                                        Enable 2FA
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Verify OTP Modal */}
            <Modal
                open={showVerifyModal}
                onCancel={() => {
                    setShowVerifyModal(false);
                    setCode(["", "", "", "", "", ""]);
                    setError(null);
                }}
                title="Verify Two-Factor Authentication"
                subtitle="Enter the 6-digit code sent to your email"
                width={480}
            >
                <div className="space-y-5">
                    {/* Email indicator */}
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                        <p className="text-xs text-blue-700">
                            We sent a code to{" "}
                            <span className="font-semibold">
                                {auth?.user?.email}
                            </span>
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleCodeChange(i, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-12 h-14 rounded-lg border-2 border-gray-200 bg-white text-center text-xl font-bold text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none hover:border-gray-300"
                            />
                        ))}
                    </div>

                    {/* Resend */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendCooldown > 0 || isResending}
                            className={`text-xs transition-colors ${
                                resendCooldown > 0
                                    ? "text-slate-400 cursor-not-allowed"
                                    : "text-blue-600 hover:text-blue-700 cursor-pointer"
                            }`}
                        >
                            {isResending
                                ? "Sending…"
                                : resendCooldown > 0
                                ? `Resend code in ${resendCooldown}s`
                                : "Didn't receive the code? Resend"}
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            className="rounded-lg"
                            onClick={() => {
                                setShowVerifyModal(false);
                                setCode(["", "", "", "", "", ""]);
                                setError(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-lg px-6"
                            onClick={handleVerify}
                            disabled={isVerifying || code.join("").length !== 6}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    Verifying…
                                </>
                            ) : (
                                "Verify & Enable"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Disable Confirmation Modal */}
            <Modal
                open={showDisableConfirm}
                onCancel={() => setShowDisableConfirm(false)}
                title="Disable Two-Factor Authentication"
                subtitle="Are you sure you want to disable 2FA?"
                width={440}
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Disabling two-factor authentication will make your
                        account less secure. You can re-enable it at any time.
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="light"
                            size="sm"
                            outlined
                            className="rounded-lg"
                            onClick={() => setShowDisableConfirm(false)}
                        >
                            Keep enabled
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-lg bg-red-600 hover:bg-red-700 border-red-600 px-6"
                            onClick={handleDisable}
                            disabled={isDisabling}
                        >
                            {isDisabling ? "Disabling…" : "Disable 2FA"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
