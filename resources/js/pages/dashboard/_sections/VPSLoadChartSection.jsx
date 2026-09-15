import React from 'react';
import Card from '@/components/Card';
import NeedsAttentionSection from './NeedsAttentionSection';
import RecentSystemActivitySection from './RecentSystemActivitySection';

const CHART_Y_LABELS = ['80%', '60%', '40%', '20%', '0%'];
const CHART_X_LABELS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

const CHART_LINES = {
    cpu: "M 0,35 C 15,36 30,32 45,26 C 60,20 75,18 90,21 C 95,22 100,26 100,26",
    memory: "M 0,77 C 15,82 30,73 45,46 C 60,33 75,30 90,44 C 95,49 100,53 100,53",
    disk: "M 0,72 C 15,75 30,68 45,55 C 60,45 75,42 90,56 C 95,61 100,65 100,65",
};

export default function VPSLoadChartSection() {
    return (
        <div className="space-y-4 w-full">
            {/* Top Grid: VPS Chart + Needs Attention */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* VPS Load Chart Card */}
                <Card className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            VPS load — last 24 hours
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 mb-4">
                            CPU, memory and disk I/O sampled every three hours
                        </p>
                    </div>

                    {/* Chart Container */}
                    <div className="relative pt-2">
                        <div className="flex h-56 w-full">
                            {/* Y-Axis */}
                            <div className="flex flex-col justify-between text-[11px] text-slate-400 pr-3 select-none pb-6">
                                {CHART_Y_LABELS.map((label) => (
                                    <span key={label}>{label}</span>
                                ))}
                            </div>

                            {/* SVG Interactive Line Chart */}
                            <div className="relative flex-1 h-full flex flex-col justify-between">
                                {/* Horizontal Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                                    <div className="border-b border-dashed border-slate-100 w-full"></div>
                                    <div className="border-b border-dashed border-slate-100 w-full"></div>
                                    <div className="border-b border-dashed border-slate-100 w-full"></div>
                                    <div className="border-b border-dashed border-slate-100 w-full"></div>
                                    <div className="border-b border-slate-200 w-full"></div>
                                </div>

                                {/* SVG Lines */}
                                <div className="relative w-full h-[calc(100%-1.5rem)]">
                                    <svg
                                        className="w-full h-full overflow-visible"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 100 100"
                                    >
                                        {/* CPU Line (Black/Dark Slate) */}
                                        <path
                                            d={CHART_LINES.cpu}
                                            fill="none"
                                            stroke="#1e293b"
                                            strokeWidth="2"
                                            vectorEffect="non-scaling-stroke"
                                        />

                                        {/* Memory Line (Blue) */}
                                        <path
                                            d={CHART_LINES.memory}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            vectorEffect="non-scaling-stroke"
                                        />

                                        {/* Disk I/O Line (Gray Blue) */}
                                        <path
                                            d={CHART_LINES.disk}
                                            fill="none"
                                            stroke="#94a3b8"
                                            strokeWidth="2"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                </div>

                                {/* X-Axis Labels */}
                                <div className="flex justify-between text-[11px] text-slate-400 pt-2 select-none">
                                    {CHART_X_LABELS.map((label) => (
                                        <span key={label}>{label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <NeedsAttentionSection />
            </div>

            {/* Bottom Card: Recent System Activity */}
            <RecentSystemActivitySection />
        </div>
    );
}