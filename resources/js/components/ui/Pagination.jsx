import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function Pagination({ meta, onPageChange, className = "" }) {
    if (!meta || meta.last_page <= 1) return null;

    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
        >
            <p className="text-sm text-gray-500">
                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={meta.current_page <= 1}
                    aria-label="Previous page"
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                </button>
                <span className="text-sm text-gray-600">
                    Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                    type="button"
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={meta.current_page >= meta.last_page}
                    aria-label="Next page"
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
