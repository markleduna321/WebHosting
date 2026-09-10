import React from "react";

export default function Card({
    children,
    href,
    onClick,
    variant = "default", // default, danger, warning, success, primary
    outlined = false, // true or false
    padding = "p-5",
    className = "",
    ...props
}) {
    // Map variants to Tailwind classes
    const variantMap = {
        primary: "bg-blue-500 text-white",
        default: "bg-white text-gray-900",
        danger: "bg-red-500 text-white",
        warning: "bg-orange-400 text-gray-900",
        success: "bg-green-500 text-white",
    };

    const baseClasses = `flex flex-col rounded-lg transition-all hover:shadow-lg cursor-pointer ${padding}`;

    // Apply outlined styles if outlined is true
    const variantClasses = outlined
        ? (() => {
              switch (variant) {
                  case "danger":
                      return "bg-transparent border border-red-500 text-red-500";
                  case "warning":
                      return "bg-transparent border border-orange-400 text-orange-400";
                  case "success":
                      return "bg-transparent border border-green-500 text-green-500";
                  case "primary":
                      return "bg-transparent border border-blue-500 text-blue-500";
                  default:
                      return "bg-transparent border border-gray-300 text-gray-900";
              }
          })()
        : variantMap[variant] || variantMap.default;

    return (
        <a
            href={href}
            onClick={onClick}
            {...props}
            className={`${baseClasses} ${variantClasses} ${className} shadow-sm border border-1 transition duration-300 ease-in-out`}
        >
            {children}
        </a>
    );
}
