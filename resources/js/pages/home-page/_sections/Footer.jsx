import { Link } from '@inertiajs/react';

const QUICK_LINKS = ['Home', 'Plans', 'Pricing', 'Partners', 'Events'];
const SERVICES    = ['Web Hosting', 'Cloud Hosting', 'Student Plans', 'Enterprise', 'Domain Names'];

function SocialIcon({ href, label, children }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-purple-300 hover:bg-white/20 hover:text-white transition-colors"
        >
            {children}
        </a>
    );
}

export default function Footer() {
    return (
        <footer id="contact" className="bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 text-white">
            {/* Top gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Col 1 — Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-400 flex items-center justify-center text-white text-xs font-bold">
                                aT
                            </div>
                            <span className="text-lg font-bold text-white">asuraTECH</span>
                        </div>
                        <p className="text-sm text-purple-300 leading-relaxed">
                            Reliable, affordable cloud hosting built for students, developers, and growing businesses.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-2 pt-1">
                            <SocialIcon href="#" label="Twitter">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="#" label="LinkedIn">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="#" label="GitHub">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                            </SocialIcon>
                        </div>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-purple-300 mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map((label) => (
                                <li key={label}>
                                    <a href="#" className="text-sm text-purple-400 hover:text-white transition-colors">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Services */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-purple-300 mb-4">Services</h4>
                        <ul className="space-y-2.5">
                            {SERVICES.map((label) => (
                                <li key={label}>
                                    <a href="#" className="text-sm text-purple-400 hover:text-white transition-colors">
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Contact */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-purple-300 mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <span className="block text-purple-400 text-xs mb-0.5">Email</span>
                                <a href="mailto:info@asuratech.com" className="text-white hover:text-purple-200 transition-colors">
                                    info@asuratech.com
                                </a>
                            </li>
                            <li>
                                <span className="block text-purple-400 text-xs mb-0.5">Support</span>
                                <a href="mailto:support@asuratech.com" className="text-white hover:text-purple-200 transition-colors">
                                    support@asuratech.com
                                </a>
                            </li>
                            <li>
                                <span className="block text-purple-400 text-xs mb-0.5">Location</span>
                                <span className="text-purple-300">Ghana, West Africa</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom copyright bar */}
            <div className="border-t border-purple-800/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-400">
                    <span>&copy; {new Date().getFullYear()} asuraTECH Solutions. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
