import { FolderPlus, Upload } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import DropDown from "@/components/ui/Dropdown";

const WEBSITES = [
    { label: "Portfolio 2026", onClick: () => {} },
    { label: "CS Thesis — Traffic Model", onClick: () => {} },
    { label: "ACM Student Chapter", onClick: () => {} },
    { label: "Kadiwa Marketplace (demo)", onClick: () => {} },
];

export default function FileSearchSection() {
    const [selected, setSelected] = useState(WEBSITES[0].label);

    const items = WEBSITES.map((site) => ({
        label: site.label,
        onClick: () => setSelected(site.label),
    }));

    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <p className="text-xs text-slate-500 mb-1.5">Website</p>
                <DropDown buttonText={selected} items={items} align="left" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <Button
                    variant="light"
                    size="sm"
                    outlined
                    className="rounded-lg gap-1.5"
                >
                    <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                    New folder
                </Button>

                <Button
                    variant="primary"
                    size="sm"
                    className="rounded-lg gap-1.5"
                >
                    <Upload className="w-3.5 h-3.5" />
                    Upload files
                </Button>
            </div>
        </div>
    );
}
