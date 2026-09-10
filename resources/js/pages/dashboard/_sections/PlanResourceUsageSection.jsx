import { HardDrive, Cpu, Layers, MemoryStick, Globe, Info } from "lucide-react";
import React from "react";

function MiniSparkline({ color = "#7c3aed" }) {
    // Small deterministic-looking wobble line, purely decorative.
    const points = [
        [0, 14],
        [10, 10],
        [20, 16],
        [30, 8],
        [40, 12],
        [50, 6],
        [60, 13],
        [70, 9],
        [80, 15],
        [90, 7],
        [100, 11],
    ];
    const path = points
        .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
        .join(" ");
    return (
        <svg
            viewBox="0 0 100 20"
            className="w-20 h-6"
            preserveAspectRatio="none"
        >
            <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MetricRow({ icon, label, value, valueColor = "text-slate-900", suffix }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-slate-400">{icon}</span>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-sm font-bold">
                <span className={valueColor}>{value}</span>
                {suffix && (
                    <span className="font-normal text-slate-400"> / {suffix}</span>
                )}
            </p>
        </div>
    );
}

export default function PlanResourceUsageSection() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900">
                    Plan resource usage
                </h2>
                <button className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    See details
                </button>
            </div>

            <div className="flex items-stretch gap-8">
                {/* Left: disk usage ring + inodes + websites */}
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 shrink-0">
                        <svg viewBox="0 0 44 44" className="w-16 h-16 -rotate-90">
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                            />
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 18}
                                strokeDashoffset={2 * Math.PI * 18 * (1 - 0.19)}
                                strokeLinecap="round"
                            />
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="#7c3aed"
                                strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 18}
                                strokeDashoffset={2 * Math.PI * 18 * (1 - 0.05)}
                                strokeLinecap="round"
                                transform="rotate(68.4 22 22)"
                            />
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 18}
                                strokeDashoffset={2 * Math.PI * 18 * (1 - 0.5)}
                                strokeLinecap="round"
                                transform="rotate(86.4 22 22)"
                            />
                        </svg>
                    </div>
                    <div className="space-y-2.5">
                        <MetricRow
                            icon={<HardDrive className="w-4 h-4" />}
                            label="Disk usage"
                            value="0.99 GB"
                            valueColor="text-purple-600"
                            suffix="20 GB"
                        />
                        <MetricRow
                            icon={<Layers className="w-4 h-4" />}
                            label="Inodes"
                            value="77.06K"
                            valueColor="text-green-600"
                            suffix="400K"
                        />
                        <MetricRow
                            icon={<Globe className="w-4 h-4" />}
                            label="Websites"
                            value="4"
                            valueColor="text-blue-600"
                            suffix="3"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-200" />

                {/* Right: CPU + memory + last updated */}
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">CPU</p>
                        <div className="flex items-end justify-between gap-4">
                            <p className="text-sm font-bold text-slate-900">2%</p>
                            <MiniSparkline color="#7c3aed" />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500 mb-1">Memory</p>
                        <div className="flex items-end justify-between gap-4">
                            <p className="text-sm font-bold text-slate-900">35 MB</p>
                            <MiniSparkline color="#7c3aed" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Info className="w-3.5 h-3.5" />
                        Last <span className="text-blue-500">24 hours</span>
                    </div>
                </div>
            </div>
        </div>
    );
}