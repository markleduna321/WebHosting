import { Globe, HardDrive, Cpu, MemoryStick } from "lucide-react";
import React from "react";
import Layout from "../../layout";

export default function Page() {
    return (
        <Layout title="Dashboard" subtitle="Maria Clara Santos · Student Pro plan">
            <div className="space-y-6">
                {/* Site Header Card */}
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                asuratechsolutions.com
                            </p>
                            <p className="text-xs text-slate-500">
                                Created: 2026-04-02
                            </p>
                        </div>
                    </div>
                </div>

                {/* Essentials + Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4">
                            Essentials
                        </h2>
                        <ul className="divide-y divide-gray-100">
                            {[
                                "Database",
                                "Backups",
                                "File manager",
                                "Hosting plan",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center justify-between py-3 text-sm"
                                >
                                    <span className="text-slate-700">
                                        {item}
                                    </span>
                                    <span className="text-slate-400">
                                        &gt;
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-4">
                            Plan resource usage
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-slate-500">
                                        Disk usage
                                    </p>
                                    <p className="font-semibold text-slate-900">
                                        0.99 GB / 20 GB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-slate-500">CPU</p>
                                    <p className="font-semibold text-slate-900">
                                        2%
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-slate-500">
                                        Websites
                                    </p>
                                    <p className="font-semibold text-slate-900">
                                        1 / 3
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MemoryStick className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-slate-500">Memory</p>
                                    <p className="font-semibold text-slate-900">
                                        35 MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
