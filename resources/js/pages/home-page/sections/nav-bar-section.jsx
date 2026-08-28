import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
// Respect a saved preference first, otherwise fall back to the OS setting.
function getInitialDarkMode() {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function NavBarSection() {
    const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle Dark Mode Class on the Document Element
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    // Keep following the OS theme in real time until the user picks one explicitly
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemChange = (e) => {
            if (!window.localStorage.getItem("theme")) {
                setIsDarkMode(e.matches);
            }
        };
        media.addEventListener("change", handleSystemChange);
        return () => media.removeEventListener("change", handleSystemChange);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const next = !prev;
            window.localStorage.setItem("theme", next ? "dark" : "light");
            return next;
        });
    };

    const navLinks = [
        { name: "Home", href: "home" },
        { name: "Hosting Plans", href: "hosting-plans" },
        { name: "Features", href: "features" },
        { name: "Partners", href: "partners" },
        { name: "About Us", href: "about-us" },
    ];

    const handleNavClick = (e, id) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 font-sans transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center space-x-2.5 cursor-pointer"
                >
                    <div className="flex items-center justify-center">
                        <img
                            src="/images/asura-logo.png"
                            alt="AsuraTechHost Logo"
                            className="w-9 h-9 object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Asura
                        <span className="text-blue-600 dark:text-blue-500">
                            Host
                        </span>
                    </span>
                </Link>

                <nav className="hidden lg:flex items-center space-x-14 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="hover:text-slate-900 dark:hover:text-white transition-colors hover-bg-gray-100 dark:hover:bg-slate-800 hover-border-gray-200 dark:hover:border-slate-700"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden lg:flex items-center space-x-5 text-sm font-medium">
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

                    {/* Log In Link */}
                    <a
                        href="/login"
                        className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Log In
                    </a>

                    {/* Sign Up CTA Button */}
                    <a
                        href="/register"
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        Sign Up
                    </a>
                </div>

                {/* Mobile Right Controls (Toggle + Hamburger) */}
                <div className="flex items-center space-x-2 lg:hidden">
                    <button
                        onClick={toggleDarkMode}
                        aria-label="Toggle Dark Mode"
                        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {isDarkMode ? (
                            <svg
                                className="w-5 h-5 text-amber-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                        {isMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 pt-4 pb-6 space-y-4">
                    <nav className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col space-y-3">
                        <a
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-base font-medium text-slate-700 dark:text-slate-200"
                        >
                            Log In
                        </a>
                        <a
                            href="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center bg-blue-600 dark:bg-blue-500 text-white font-medium py-2 rounded-xl"
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
