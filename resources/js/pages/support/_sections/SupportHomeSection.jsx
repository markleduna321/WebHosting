import { Link } from "@inertiajs/react";
import { ArrowRight, BookOpen, LifeBuoy, MessageCircle, ShieldCheck } from "lucide-react";
import React from "react";

const TOPICS = [
    {
        title: "Plans & billing",
        description: "Checkout, payments, subscriptions, and invoices.",
        icon: ShieldCheck,
        href: "/account-billing?tab=subscription",
        guestHref: "/knowledge-base",
    },
    {
        title: "Hosting tools",
        description: "Deployments, files, databases, and domains.",
        icon: LifeBuoy,
        href: "/knowledge-base",
    },
    {
        title: "Guides",
        description: "Step-by-step help for common account tasks.",
        icon: BookOpen,
        href: "/knowledge-base",
    },
];

export default function SupportHomeSection({ isAuthenticated = false }) {
    return (
        <div className="relative min-h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-[#080C14] px-5 py-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.13),transparent_48%)]" />
            <div className="relative mx-auto max-w-4xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-cyan-300">
                        <LifeBuoy className="h-4 w-4" />
                        Caleho Host Support
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <Link href="/knowledge-base" className="transition-colors hover:text-white">Knowledge base</Link>
                        <Link href={isAuthenticated ? "/dashboard" : "/"} className="transition-colors hover:text-white">{isAuthenticated ? "Dashboard" : "Home"}</Link>
                        {!isAuthenticated && <Link href="/login" className="transition-colors hover:text-white">Log in</Link>}
                    </div>
                </div>

                <div className="mt-12 max-w-2xl sm:mt-16">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">How can we help?</h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                        Find product guidance or start a conversation with Caleho support.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent("caleho:support:open"))}
                        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C14]"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Start a support chat
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="mt-3 text-xs text-slate-500">
                        AI-assisted Caleho Host support only. It can’t write, debug, or fix code. Never share passwords, one-time codes, or payment details.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TOPICS.map(({ title, description, icon: Icon, href, guestHref }) => (
                        <Link
                            key={title}
                            href={!isAuthenticated && guestHref ? guestHref : href}
                            className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-cyan-300/30 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                            <Icon className="h-5 w-5 text-cyan-300" />
                            <h2 className="mt-4 text-sm font-semibold text-slate-100">{title}</h2>
                            <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cyan-200">
                                Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
