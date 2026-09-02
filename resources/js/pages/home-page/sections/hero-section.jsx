import React, { useState } from "react";
import { ArrowRight, CheckCircle, Server, ShieldCheck } from "lucide-react";

function DodgingBadge({ children, className }) {
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const badgeCenterX = rect.left + rect.width / 2;
        const badgeCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - badgeCenterX;
        const deltaY = e.clientY - badgeCenterY;
        const distance = Math.hypot(deltaX, deltaY);

        const dodgeThreshold = 140;

        if (distance < dodgeThreshold && distance > 0) {
            const force = Math.pow(
                (dodgeThreshold - distance) / dodgeThreshold,
                1.5,
            );
            const maxDodgeDistance = 35;

            const pushX = -(deltaX / distance) * force * maxDodgeDistance;
            const pushY = -(deltaY / distance) * force * maxDodgeDistance;

            setOffset({ x: pushX, y: pushY });
        }
    };

    const handleMouseLeave = () => {
        setOffset({ x: 0, y: 0 });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className={`absolute z-20 flex items-center space-x-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-lg text-xs font-semibold select-none cursor-pointer transition-shadow hover:shadow-xl ${className}`}
        >
            {children}
        </div>
    );
}

export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative w-full min-h-screen h-[100dvh] scroll-mt-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center transition-colors duration-200 overflow-hidden font-sans py-12 lg:py-0"
        >
            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

            {/* Full Width & Maximized Grid Container */}
            <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto">
                {/* Left Column: Text & CTAs */}
                <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-center lg:text-left pr-0 lg:pr-4">
                    {/* Top Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>
                            Verified student pricing —{" "}
                            <strong className="text-blue-600 dark:text-blue-400 font-bold">
                                from ₱49/month
                            </strong>
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold  tracking-wide">
                        Student hosting made{" "}
                        <span className="text-slate-900 dark:text-slate-100">
                            simple
                        </span>
                        ,{" "}
                        <span className="text-slate-900 dark:text-slate-100">
                            affordable
                        </span>{" "}
                        &amp;{" "}
                        <span className="text-blue-600 dark:text-blue-500 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            powerful
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto lg:mx-0 font-normal leading-relaxed">
                        Launch your website, portfolio, school project, or
                        personal application with reliable hosting built
                        specifically for students.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                        <a
                            href="#get-started"
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold px-7 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-150"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#hosting-plans"
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-[0.98] text-slate-800 dark:text-slate-200 font-semibold px-7 py-4 rounded-xl shadow-sm transition-all duration-150"
                        >
                            View Hosting Plans
                        </a>
                    </div>

                    {/* Feature Bullets */}
                    <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Free SSL</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Free domain</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>99.9% uptime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Full-height Responsive Visual Container */}
                <div className="lg:col-span-6 w-full flex justify-center items-center h-full">
                    <div className="relative w-full group">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-3xl blur-3xl transition-all group-hover:blur-[100px]" />

                        <div className="relative rounded-3xl w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[50vh] flex items-center justify-center overflow-hidden">
                            {/* Dodging Badge 1 */}
                            <DodgingBadge className="top-2 left-2 sm:top-4 sm:left-4 px-4 py-2.5 text-xs sm:text-sm">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-slate-900 dark:text-white leading-tight font-semibold">
                                        SSL Active
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                        portfolio.dev
                                    </div>
                                </div>
                            </DodgingBadge>

                            {/* Full-Height Scaled Image */}
                            <video
                                src="/video/hero.mp4"
                                alt="Hosting Service Illustration"
                                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                autoPlay
                                loop
                                muted
                            />

                            {/* Dodging Badge 2 */}
                            <DodgingBadge className="bottom-2 right-2 sm:bottom-4 sm:right-4 px-4 py-2.5 text-xs sm:text-sm">
                                <div className="p-2 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Server className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-slate-900 dark:text-white leading-tight font-semibold">
                                        Deploy complete
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                        thesis-site · 8s
                                    </div>
                                </div>
                            </DodgingBadge>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
