import Card from '@/components/Card';
import React from 'react';

export default function MonthlyRecurringRevenueSection() {
    return (
        <Card className="w-full h-full text-slate-900 overflow-hidden">
            {/* Header / Top Bar */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        Monthly recurring revenue
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Rolling 12 months, net of churn
                    </p>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-200">
                    Active
                </span>
            </div>

            {/* Key Metrics Section */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-baseline">
                {/* MRR */}
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        MRR
                    </span>
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ₱184,620
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                        <span>+9.4% vs last month</span>
                        <span className="text-slate-400 font-normal">·</span>
                        <span>₱15,870 net new</span>
                    </div>
                </div>

                {/* Annual Run Rate */}
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        ANNUAL RUN RATE
                    </span>
                    <div className="text-2xl font-bold text-slate-900 tracking-tight">
                        ₱2,215,440
                    </div>
                </div>

                {/* Active Subscribers */}
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        ACTIVE SUBSCRIBERS
                    </span>
                    <div className="text-2xl font-bold text-slate-900 tracking-tight">
                        1,432
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative pt-2">
                <div className="flex h-56 w-full">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between text-[11px] text-slate-400 pr-3 select-none pb-6">
                        <span>200k</span>
                        <span>150k</span>
                        <span>100k</span>
                        <span>50k</span>
                        <span>0k</span>
                    </div>

                    {/* SVG Chart */}
                    <div className="relative flex-1 h-full flex flex-col justify-between">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                            <div className="border-b border-dashed border-slate-200 w-full"></div>
                            <div className="border-b border-dashed border-slate-200 w-full"></div>
                            <div className="border-b border-dashed border-slate-200 w-full"></div>
                            <div className="border-b border-dashed border-slate-200 w-full"></div>
                            <div className="border-b border-slate-200 w-full"></div>
                        </div>

                        {/* Line and Area Fill */}
                        <div className="relative w-full h-[calc(100%-1.5rem)]">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>
                                {/* Area Fill */}
                                <polygon
                                    fill="url(#blueGradient)"
                                    points="0,52 9,47 18,41 27,33 36,28 45,24 54,19 63,15 72,12 81,10 90,8 100,6 100,100 0,100"
                                />
                                {/* Blue Line */}
                                <polyline
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                    points="0,52 9,47 18,41 27,33 36,28 45,24 54,19 63,15 72,12 81,10 90,8 100,6"
                                />
                            </svg>
                        </div>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between text-[11px] text-slate-400 pt-2 select-none">
                            <span>Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                            <span>Sep</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </Card>
    );
}