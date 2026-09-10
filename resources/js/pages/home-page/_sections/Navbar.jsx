import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const NAV_LINKS = [
    { label: 'Home',     href: '#' },
    { label: 'Plans',    href: '#plans' },
    { label: 'Pricing',  href: '#plans' },
    { label: 'Partners', href: '#partners' },
    { label: 'Events',   href: '#events' },
    { label: 'Contact',  href: '#contact' },
];

export default function Navbar() {
    const [scrolled,    setScrolled]    = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo mark + wordmark */}
                    <a href="#" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-white text-xs font-bold select-none">
                            aT
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                            asuraTECH
                        </span>
                        <span className="text-xl font-medium text-gray-700">Solutions</span>
                    </a>

                    {/* Desktop nav links with animated underline */}
                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="relative group text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors py-1"
                            >
                                {link.label}
                                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                            </a>
                        ))}
                    </div>

                    {/* Auth buttons + hamburger */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm font-semibold bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-purple-200 hover:opacity-90 transition-all"
                        >
                            Sign up
                        </Link>
                        <button
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label="Toggle navigation menu"
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            {mobileOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                href="/login"
                                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
