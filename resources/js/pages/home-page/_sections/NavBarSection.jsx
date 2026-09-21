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
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

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

    // Track scroll position to trigger background/border styles
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Disable background page scrolling when full-screen mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

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
        <header
            className={`sticky top-0 z-50 w-full font-sans transition-all duration-300 ${
                isScrolled || isMenuOpen
                    ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
                <Link
                    href="/"
                    className="flex items-center space-x-2.5 cursor-pointer"
                >
                    <a
                        href="https://www.caleho.cloud/"
                        className="flex items-center space-x-2.5 cursor-pointer"    
                        draggable="true"
                    >
                        <img
                            src="/images/caleho.png"
                            alt="CALEHO Host"
                            draggable="true"
                            className="
            w-[125px]
            sm:w-[135px]
            lg:w-[140px]
            h-auto
            object-contain
            block
            transition-transform
            duration-200
            group-hover:scale-[1.02]
        "
                        />
                    </a>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-14 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden lg:flex items-center space-x-5 text-sm font-medium">
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

                    {/* Log In Link */}
                    <Link
                        href="/login"
                        className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Log In
                    </Link>

                    {/* Sign Up CTA Button */}
                    <Link
                        href="/register"
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Right Controls (Hamburger Toggle) */}
                <div className="flex items-center space-x-2 lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
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

            {/* Mobile Full-Screen Overlay Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-50 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 px-6 py-8 flex flex-col justify-between overflow-y-auto transition-all">
                    <nav className="flex flex-col space-y-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-xl font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col space-y-4">
                        <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center py-3 font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center bg-blue-600 dark:bg-blue-500 text-white font-medium py-3 rounded-xl shadow-md"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
