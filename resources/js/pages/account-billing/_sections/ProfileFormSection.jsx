import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfileFormSection() {
    const [form, setForm] = useState({
        fullName: "Maria Clara Santos",
        studentEmail: "admin@gmail.com",
        school: "University of the Philippines Diliman",
    });

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">Profile</h2>
            <p className="mt-1 text-xs text-blue-400">
                This information appears on your invoices and student
                verification.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Input
                    label="Full name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                />
                <Input
                    label="Student email"
                    name="studentEmail"
                    type="email"
                    value={form.studentEmail}
                    onChange={handleChange("studentEmail")}
                />
                <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-xs font-medium text-slate-700">
                            School / University
                        </span>
                        <span className="text-xs text-slate-400">Optional</span>
                    </div>
                    <Input
                        name="school"
                        value={form.school}
                        onChange={handleChange("school")}
                    />
                </div>

                <div className="flex justify-end pt-1">
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="rounded-lg px-6"
                    >
                        Save changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
