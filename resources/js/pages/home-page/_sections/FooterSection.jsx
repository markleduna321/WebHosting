import React from "react";
import { Mail } from "lucide-react";
import { Link } from "@inertiajs/react";
const FacebookIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93v-1.9c0-.86.24-1.44 1.47-1.44h1.57V4.14c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H8v2.96h2.46V21h3.04z" />
    </svg>
);

const InstagramIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        {...props}
    >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const LinkedinIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.44-2.16 2.96V21H9z" />
    </svg>
);

const GithubIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
);

const LINK_COLUMNS = [
    {
        title: "Platform",
        links: [
            { label: "Home", href: "#home" },
            { label: "Hosting Plans", href: "#hosting-plans" },
            { label: "Features", href: "#features" },
            { label: "Partners", href: "#partners" },
            { label: "About Us", href: "#about-us" },
        ],
    },
    {
        title: "Resources",
        links: [
            // { label: "Documentation", href: "#documentation" },
            // { label: "Help Center", href: "#help-center" },
            // { label: "Tutorials", href: "#tutorials" },
            { label: "FAQs", href: "#faqs" }, 
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Log In", href: "/login" },
            { label: "Sign Up", href: "/register" },
            { label: "My Hosting", href: "/login" },
            { label: "Billing", href: "/login" },
        ],
    },
];

const SOCIAL_LINKS = [
    {
        icon: FacebookIcon,
        href: "https://www.facebook.com/share/1BrH2TSyqz/",
        label: "Facebook",
    },
    {
        icon: InstagramIcon,
        href: "https://www.instagram.com/asuratech_admin",
        label: "Instagram",
    },
    {
        icon: LinkedinIcon,
        href: "https://www.linkedin.com/company/asuratech-solutions",
        label: "LinkedIn",
    },
    {
        icon: GithubIcon,
        href: "https://github.com/calehohost",
        label: "GitHub",
    },
];

export default function FooterSection() {
    const year = new Date().getFullYear();

    const handleFaqsClick = (e) => {
        e.preventDefault();
        document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="bg-slate-900 text-slate-300 px-4 sm:px-6 lg:px-8 pt-16 pb-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Brand, description, socials & contact */}
                    <div className="lg:col-span-4">
                        <a href="/" className="flex items-center gap-2.5">
                            <img
                                src="/images/logo 3.png"
                                alt="CALEHO Host Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <span className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-400 bg-clip-text text-transparent font-bold">
                                CALEHO
                                <span className="text-blue-500"> HOST</span>
                            </span>
                        </a>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                            Affordable and reliable web hosting built to help
                            students learn, create, and launch online.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            {" "}
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit our ${label}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                                >
                                    {" "}
                                    <Icon className="w-4 h-4" />{" "}
                                </a>
                            ))}{" "}
                        </div>

                        <div className="mt-10">
                            <h4 className="text-sm font-bold text-white">
                                Contact
                            </h4>
                            <a
                                href="mailto:support@calehohost.com"
                                className="mt-3 flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
                            >
                                <Mail className="w-4 h-4 shrink-0" />
                                support@calehohost.com
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    {LINK_COLUMNS.map((column) => (
                        <div key={column.title} className="lg:col-span-2">
                            <h4 className="text-sm font-bold text-white">
                                {column.title}
                            </h4>
                            <ul className="mt-4 space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={
                                                link.href === "#faqs"
                                                    ? handleFaqsClick
                                                    : undefined
                                            }
                                            className="text-sm text-slate-300 transition-colors hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
                    <p>© {year} CALEHO Host. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link
                            href="/privacy-policy"
                            className="transition-colors hover:text-white"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="transition-colors hover:text-white"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
