import React, { forwardRef } from "react";

const Input = forwardRef(
    (
        {
            label,
            name,
            type = "text",
            disabled = false,
            required = false,
            iconLeft,
            iconRight,
            error,
            readOnly = false,
            className = "",
            ...props
        },
        ref,
    ) => {
        return (
            <div className="w-full">
                <div className="relative">
                    {/* Left Icon */}
                    {iconLeft && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {iconLeft}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        autoComplete="off"
                        ref={ref}
                        id={name}
                        name={name}
                        type={type}
                        disabled={disabled}
                        required={required}
                        readOnly={readOnly}
                        step={type === "number" ? "any" : undefined}
                        placeholder=" " // needed for floating label
                        {...props}
                        className={`
              peer w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 
             
              ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
              ${className}
            `}
                    />

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`
              absolute left-3 top-2.5 bg-white px-1 text-blue-500 text-sm
              transition-all duration-200 ease-out pointer-events-none
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-blue-500
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-700
              peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs
            `}
                    >
                        {label}
                    </label>

                    {/* Right Icon */}
                    {iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {iconRight}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-1 text-sm text-red-500">
                        {error.message ?? error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";

export default Input;
