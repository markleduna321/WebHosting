import {
    Globe,
    Mail,
    ExternalLink,
    CheckCircle2,
    Lock,
    Code2,
} from "lucide-react";
import React from "react";

export default function HeaderSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600">
                        <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-slate-900">
                                asuratechsolutions.com
                            </p>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500">
                            Created: 2026-04-02
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Globe className="w-4 h-4" />
                        Manage domain
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Mail className="w-4 h-4" />
                        Manage email
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Malware protected
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SSL
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                        CDN
                    </span>
                </div>
            </div>
        </div>
    );
}
