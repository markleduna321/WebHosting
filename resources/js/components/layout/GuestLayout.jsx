import React from 'react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                {children}
            </div>
        </div>
    );
}
