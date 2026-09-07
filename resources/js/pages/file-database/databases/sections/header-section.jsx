import React from "react";
import Button from "../../../../_components/button";
import { Plus } from "lucide-react";

const USED_GB = 0.68;
const TOTAL_GB = 4;
const PERCENT = (USED_GB / TOTAL_GB) * 100;

export default function HeaderSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between gap-4">
                {/* Left: storage info */}
                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Database storage used
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-slate-900">
                            {USED_GB} GB
                        </span>
                        <span className="text-xs text-slate-400">
                            of {TOTAL_GB} GB
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 w-32 rounded-full bg-gray-100">
                        <div
                            className="h-1 rounded-full bg-blue-500"
                            style={{ width: `${PERCENT}%` }}
                        />
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    className="rounded-lg gap-1.5 shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Create database
                </Button>
            </div>
        </div>
    );
}
