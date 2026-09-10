import { HeadphonesIcon } from "lucide-react";
import React, { useState } from "react";
import Button from "@/components/ui/Button";

export default function GuideFeedbackSection() {
    const [answered, setAnswered] = useState(false);

    return (
        <div className="rounded-xl border border-gray-200 bg-white px-8 py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Left */}
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        Did this guide solve your problem?
                    </p>
                    <p className="text-xs text-blue-400 mt-0.5">
                        Your feedback helps us rewrite the guides students get
                        stuck on.
                    </p>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {answered ? (
                        <p className="text-sm text-green-600 font-medium">
                            Thanks for your feedback!
                        </p>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => setAnswered(true)}
                        >
                            Yes, it helped
                        </Button>
                    )}

                    <Button
                        variant="light"
                        size="sm"
                        outlined
                        className="rounded-lg gap-1.5"
                    >
                        <HeadphonesIcon className="w-3.5 h-3.5 text-slate-500" />
                        Ask support
                    </Button>
                </div>
            </div>
        </div>
    );
}
