
import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { CircleAlert, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const CONFIRMATION_PHRASE = "delete my account";

export default function DeleteAccountSection() {
    const { auth } = usePage().props;
    const userName = auth?.user?.name ?? "";

    const [open, setOpen] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({ name: "", confirmation: "" });

    const bothMatch =
        data.name === userName &&
        data.confirmation === CONFIRMATION_PHRASE;

    const closeModal = () => {
        if (processing) return;
        setOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        destroy("/profile", {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    // Prevent copy, paste, cut, drop, and context menu
    const preventClipboard = (e) => {
        e.preventDefault();
    };

    return (
        <div className="rounded-xl border border-red-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">
                Delete Account
            </h2>

            <p className="mt-1 text-xs text-slate-500">
                Permanently delete your account and all of its data. This action
                cannot be undone.
            </p>

            <div className="mt-4 flex justify-end">
                <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="rounded-lg px-6"
                    onClick={() => setOpen(true)}
                >
                    Delete Account
                </Button>
            </div>

            <Modal
                open={open}
                onCancel={closeModal}
                title="Delete Account"
                width={480}
                footer={null}
            >
                <p className="text-sm text-slate-600">
                    This will permanently delete your account and related
                    resources like websites, domains and billing records.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Name Confirmation */}
                    <div>
                        <label
                            htmlFor="delete-name"
                            className="block text-xs font-semibold text-slate-700"
                        >
                            To confirm, type{" "}
                            <span className="font-bold text-slate-900">
                                &ldquo;{userName}&rdquo;
                            </span>
                        </label>

                        <input
                            id="delete-name"
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData("name", e.target.value)
                            }
                            autoComplete="off"
                            onCopy={preventClipboard}
                            onPaste={preventClipboard}
                            onCut={preventClipboard}
                            onDrop={preventClipboard}
                            onContextMenu={preventClipboard}
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />

                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Phrase Confirmation */}
                    <div>
                        <label
                            htmlFor="delete-confirmation"
                            className="block text-xs font-semibold text-slate-700"
                        >
                            To confirm, type{" "}
                            <span className="font-bold text-slate-900">
                                &ldquo;{CONFIRMATION_PHRASE}&rdquo;
                            </span>
                        </label>

                        <input
                            id="delete-confirmation"
                            type="text"
                            value={data.confirmation}
                            onChange={(e) =>
                                setData("confirmation", e.target.value)
                            }
                            autoComplete="off"
                            onCopy={preventClipboard}
                            onPaste={preventClipboard}
                            onCut={preventClipboard}
                            onDrop={preventClipboard}
                            onContextMenu={preventClipboard}
                            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />

                        {errors.confirmation && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.confirmation}
                            </p>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600">
                        <CircleAlert className="h-4 w-4 shrink-0" />
                        Deleting {userName} cannot be undone.
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="rounded-lg px-5"
                            onClick={closeModal}
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="danger"
                            size="sm"
                            className="rounded-lg px-5"
                            disabled={!bothMatch || processing}
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <Trash2 className="h-4 w-4" />
                                {processing
                                    ? "Deleting…"
                                    : "Delete Account"}
                            </span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

