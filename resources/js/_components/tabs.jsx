import { Link } from "@inertiajs/react";
import React, { useState } from "react";

/**
 * TabPanel — used with the id-based (internal state) pattern.
 */
export function TabPanel({ id, children }) {
    return <div data-tab-id={id}>{children}</div>;
}

/**
 * Tabs — supports two patterns:
 *
 * 1. Path-based (Inertia navigation):
 *    Each tab has { label, path, active, icon? }.
 *    Pass content as `children` rendered below the tab bar.
 *
 * 2. Id-based (internal state):
 *    Each tab has { id, label, icon? }.
 *    Pass <TabPanel id="..."> children; the matching panel is shown.
 */
export default function Tabs({ tabs, defaultTabId, onChange, children }) {
    const isPathBased = tabs[0]?.path !== undefined;

    // --- Id-based state ---
    const [activeId, setActiveId] = useState(defaultTabId || tabs[0]?.id || "");

    const handleClick = (id) => {
        setActiveId(id);
        if (onChange) onChange(id);
    };

    const activeContent = !isPathBased
        ? React.Children.toArray(children).find(
              (child) =>
                  React.isValidElement(child) && child.props.id === activeId,
          )
        : null;

    return (
        <div className="w-full">
            {/* Tab bar */}
            <div className="inline-flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                {tabs.map((tab) => {
                    const isActive = isPathBased
                        ? tab.active
                        : tab.id === activeId;

                    const baseClass = `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                            ? "bg-[#0F172A] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`;

                    const inner = (
                        <>
                            {tab.icon && (
                                <span className="w-4 h-4 flex items-center justify-center">
                                    {tab.icon}
                                </span>
                            )}
                            <span>{tab.label}</span>
                        </>
                    );

                    if (isPathBased) {
                        return (
                            <Link
                                key={tab.label}
                                href={tab.path}
                                className={baseClass}
                            >
                                {inner}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleClick(tab.id)}
                            className={baseClass}
                        >
                            {inner}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="mt-4">
                {isPathBased ? children : activeContent}
            </div>
        </div>
    );
}
