import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ConnectDomainSection() {
    const [domain, setDomain] = useState("");
    const [pointTo, setPointTo] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            {/* Header */}
            <h2 className="text-sm font-bold text-slate-900">
                Connect a domain
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Already own a domain? Point it at one of your websites — SSL is
                issued automatically once DNS resolves.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Input
                    label="Domain"
                    name="domain"
                    type="text"
                    value={domain}
                    placeholder="myproject.dev"
                    onChange={(e) => setDomain(e.target.value)}
                />

                <Input
                    label="Point to website"
                    name="point-to"
                    type="text"
                    value={pointTo}
                    onChange={(e) => setPointTo(e.target.value)}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center rounded-xl py-3"
                >
                    Add domain
                </Button>
            </form>
        </div>
    );
}
