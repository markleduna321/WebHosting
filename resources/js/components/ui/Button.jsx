import React, { forwardRef } from 'react';

const VARIANT_CLASSES = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZE_CLASSES = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
};

const Button = forwardRef(function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    loading = false,
    disabled = false,
    ...props
}, ref) {
    const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
    const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
    const isDisabled = disabled || loading;

    const spinnerColor = variant === 'primary' || variant === 'danger' ? 'border-white' : 'border-gray-500';

    return (
        <button
            {...props}
            ref={ref}
            disabled={isDisabled}
            className={`inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${variantClass} ${sizeClass} ${className}`}
        >
            {loading && (
                <span className={`animate-spin mr-2 h-4 w-4 rounded-full border-2 ${spinnerColor} border-t-transparent`} />
            )}

            <span>{children}</span>
        </button>
    );
});

export default Button;
