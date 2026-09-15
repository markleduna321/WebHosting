import React from "react";

function Block({ className = "" }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

function Card({ children, className = "" }) {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
            {children}
        </div>
    );
}

function HeaderSkeleton() {
    return (
        <Card>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Block className="h-8 w-8 rounded-lg" />
                    <div className="space-y-2">
                        <Block className="h-4 w-56" />
                        <Block className="h-3 w-28" />
                    </div>
                </div>
                <Block className="h-5 w-20 rounded-full" />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <Block className="h-9 w-32 rounded-full" />
                    <Block className="h-9 w-28 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Block className="h-7 w-28 rounded-full" />
                    <Block className="h-7 w-20 rounded-full" />
                    <Block className="h-7 w-20 rounded-full" />
                </div>
            </div>
        </Card>
    );
}

function ShortcutSkeleton() {
    return (
        <Card>
            <div className="flex flex-wrap items-center gap-2">
                <Block className="h-10 w-36 rounded-lg" />
                <Block className="h-10 w-24 rounded-lg" />
                <Block className="h-10 w-28 rounded-lg" />
                <Block className="h-10 w-28 rounded-lg" />
                <Block className="h-10 w-28 rounded-lg" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Block className="h-3 w-48" />
                <Block className="h-3 w-44" />
                <Block className="h-3 w-36" />
            </div>
        </Card>
    );
}

function ProjectListSkeleton() {
    return (
        <Card className="min-h-[22rem]">
            <Block className="h-4 w-24" />
            <Block className="mt-2 h-3 w-36" />

            <div className="mt-6 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
                        <div className="min-w-0 flex-1 space-y-2">
                            <Block className="h-4 w-1/2" />
                            <Block className="h-3 w-5/6" />
                        </div>
                        <Block className="h-7 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        </Card>
    );
}

function RightStackSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <div className="flex items-center justify-between gap-4">
                    <Block className="h-4 w-28" />
                    <Block className="h-8 w-24 rounded-full" />
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <Block className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <Block className="h-4 w-24" />
                        <Block className="h-3 w-16" />
                        <Block className="h-3 w-20" />
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <Block className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <Block className="h-4 w-24" />
                        <Block className="h-3 w-20" />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between gap-4">
                    <Block className="h-4 w-36" />
                    <Block className="h-8 w-20 rounded-full" />
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <Block className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <Block className="h-4 w-28" />
                        <Block className="h-3 w-24" />
                        <Block className="h-3 w-20" />
                    </div>
                </div>
            </Card>
        </div>
    );
}

function TipsSkeleton() {
    return (
        <Card>
            <Block className="h-4 w-28" />
            <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <Block className="h-9 w-9 rounded-lg" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Block className="h-4 w-2/3" />
                                <Block className="h-3 w-full" />
                                <Block className="h-3 w-5/6" />
                            </div>
                        </div>
                        <Block className="h-8 w-24 rounded-full" />
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading dashboard">
            <Card className="border-amber-200 bg-amber-50/70">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Block className="h-5 w-5 rounded-full bg-amber-200/80" />
                        <div className="space-y-2">
                            <Block className="h-4 w-48 bg-amber-200/80" />
                            <Block className="h-3 w-80 bg-amber-100/90" />
                        </div>
                    </div>
                    <Block className="h-9 w-40 rounded-lg bg-amber-200/80" />
                </div>
            </Card>

            <HeaderSkeleton />
            <ShortcutSkeleton />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ProjectListSkeleton />
                <RightStackSkeleton />
            </div>

            <TipsSkeleton />
        </div>
    );
}