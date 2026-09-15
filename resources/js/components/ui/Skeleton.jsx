import React from "react";

const textWidths = [
    "w-full",
    "w-11/12",
    "w-5/6",
    "w-full",
    "w-4/5",
    "w-3/4",
];

function SkeletonItem({
    className = "",
    rounded = "rounded-md",
}) {
    return (
        <div
            className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
        />
    );
}

export default function Skeleton({
    variant = "text",
    lines = 5,
    className = "",
}) {
    switch (variant) {
        case "avatar":
            return (
                <div className={`flex items-center gap-4 ${className}`}>
                    <SkeletonItem className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <SkeletonItem className="h-4 w-40" />
                        <SkeletonItem className="h-3 w-24" />
                    </div>
                </div>
            );

        case "button":
            return (
                <SkeletonItem
                    className={`h-10 w-32 rounded-lg ${className}`}
                />
            );

        case "input":
            return (
                <SkeletonItem
                    className={`h-11 w-full rounded-lg ${className}`}
                />
            );

        case "image":
            return (
                <SkeletonItem
                    className={`aspect-video w-full rounded-xl ${className}`}
                />
            );

        case "card":
            return (
                <div
                    className={`border border-gray-200 rounded-xl p-4 space-y-4 ${className}`}
                >
                    <SkeletonItem className="h-44 w-full rounded-lg" />

                    <SkeletonItem className="h-5 w-2/3" />

                    <SkeletonItem className="h-4 w-full" />
                    <SkeletonItem className="h-4 w-5/6" />

                    <div className="flex justify-between pt-2">
                        <SkeletonItem className="h-8 w-24 rounded-lg" />
                        <SkeletonItem className="h-8 w-20 rounded-lg" />
                    </div>
                </div>
            );

        case "profile":
            return (
                <div className={`space-y-5 ${className}`}>
                    <div className="flex items-center gap-5">
                        <SkeletonItem className="h-20 w-20 rounded-full" />

                        <div className="flex-1 space-y-3">
                            <SkeletonItem className="h-6 w-56" />
                            <SkeletonItem className="h-4 w-40" />
                            <SkeletonItem className="h-4 w-32" />
                        </div>
                    </div>

                    <SkeletonItem className="h-24 w-full rounded-xl" />
                </div>
            );

        case "table":
            return (
                <div className={`space-y-3 ${className}`}>
                    <SkeletonItem className="h-12 w-full rounded-lg" />

                    {Array.from({ length: lines }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-5 gap-4"
                        >
                            <SkeletonItem className="h-4 w-full" />
                            <SkeletonItem className="h-4 w-full" />
                            <SkeletonItem className="h-4 w-4/5" />
                            <SkeletonItem className="h-4 w-full" />
                            <SkeletonItem className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            );

        case "dashboard":
            return (
                <div className={`space-y-6 ${className}`}>
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonItem
                                key={i}
                                className="h-28 rounded-xl"
                            />
                        ))}
                    </div>

                    <SkeletonItem className="h-72 rounded-xl" />

                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonItem className="h-60 rounded-xl" />
                        <SkeletonItem className="h-60 rounded-xl" />
                    </div>
                </div>
            );

        case "text":
        default:
            return (
                <div
                    className={`space-y-3 ${className}`}
                    aria-busy="true"
                >
                    {Array.from({ length: lines }).map((_, index) => (
                        <SkeletonItem
                            key={index}
                            className={`h-3 ${
                                textWidths[index % textWidths.length]
                            }`}
                        />
                    ))}
                </div>
            );
    }
}