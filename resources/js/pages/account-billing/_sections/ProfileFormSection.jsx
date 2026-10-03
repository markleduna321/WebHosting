import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useUpdateUserMutation } from "@/features/user/userApi";

export default function ProfileFormSection() {
    const { profile, auth } = usePage().props;

    const [form, setForm] = useState({
        name: profile?.name ?? auth?.user?.name ?? "",
        email: profile?.email ?? auth?.user?.email ?? "",
    });

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: null }));
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        try {
            await updateUser({
                name: form.name,
                email: form.email,
            }).unwrap();

            setSuccess(true);

            // Reload the page to refresh Inertia shared data
            router.reload({ only: ["profile", "auth"] });
        } catch (err) {
            if (err?.data?.errors) {
                setErrors(err.data.errors);
            } else {
                setErrors({ general: err?.data?.message || "Failed to update profile." });
            }
        }
    };
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">Profile</h2>
            <p className="mt-1 text-xs text-blue-400">
                This information appears on your invoices and account.
            </p>

            {success && (
                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-700">
                    Profile updated successfully.
                </div>
            )}

            {errors.general && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Input
                    label="Full name"
                    name="fullName"
                    value={form.name}
                    onChange={handleChange("name")}
                    error={errors.name?.[0]}
                />
                <Input
                    label="Email address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    error={errors.email?.[0]}
                />

                {profile?.email_verified_at && (
                    <p className="text-xs text-green-600">
                        ✓ Email verified on{" "}
                        {new Date(profile.email_verified_at).toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}
                    </p>
                )}

                <div className="flex justify-end pt-1">
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="rounded-lg px-6"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving…" : "Save changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
