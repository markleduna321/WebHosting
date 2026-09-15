import React from 'react';
import Card from '@/components/Card';
export default function HostCardSection() {
    return (
        <Card className="w-full h-full text-slate-900 max-w-xl">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        Hostinger KVM 4 <span className="text-slate-400 font-normal">·</span> srv-asuratech-01
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Singapore (SG-1) · Ubuntu 24.04 LTS
                    </p>
                </div>
                <span className="px-3 py-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full border border-emerald-200">
                    Online
                </span>
            </div>

            {/* Metrics List */}
            <div className="py-4 space-y-4">
                {/* CPU */}
                <div>
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                        <span className="flex items-center gap-2 text-slate-800">
                            {/* CPU Icon */}
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            CPU
                        </span>
                        <span className="text-slate-900 font-bold">41%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '41%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">4 vCPU · load 0.62 / 0.71 / 0.68</p>
                </div>

                {/* RAM */}
                <div>
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                        <span className="flex items-center gap-2 text-slate-800">
                            {/* RAM/Memory Icon */}
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            RAM
                        </span>
                        <span className="text-slate-900 font-bold">9.4 / 16 GB</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58.75%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Swap 0.4 / 4 GB</p>
                </div>

                {/* NVMe Storage */}
                <div>
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                        <span className="flex items-center gap-2 text-slate-800">
                            {/* Storage Icon */}
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                            NVMe storage
                        </span>
                        <span className="text-slate-900 font-bold">128.6 / 200 GB</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64.3%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">2,840 IOPS sustained</p>
                </div>

                {/* Bandwidth */}
                <div>
                    <div className="flex justify-between items-center text-sm font-semibold mb-1.5">
                        <span className="flex items-center gap-2 text-slate-800">
                            {/* Gauge / Speed Icon */}
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Bandwidth
                        </span>
                        <span className="text-slate-900 font-bold">2.9 / 16 TB</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '18.125%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Resets on the 1st</p>
                </div>
            </div>

            {/* Footer Metadata Grid */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-3 text-xs">
                <div>
                    <span className="text-slate-400 block mb-0.5">Uptime</span>
                    <span className="font-bold text-slate-900 text-sm">84 days 06:12</span>
                </div>
                <div>
                    <span className="text-slate-400 block mb-0.5">Public IP</span>
                    <span className="font-bold text-slate-900 text-sm">31.220.104.18</span>
                </div>
                <div>
                    <span className="text-slate-400 block mb-0.5">Last snapshot</span>
                    <span className="font-bold text-slate-900 text-sm">2026-09-11 02:00</span>
                </div>
                <div>
                    <span className="text-slate-400 block mb-0.5">Last reboot</span>
                    <span className="font-bold text-slate-900 text-sm">2026-06-19 04:22</span>
                </div>
            </div>
        </Card>
    );
}