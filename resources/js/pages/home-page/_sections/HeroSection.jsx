export default function HeroSection() {
    return (
        <section className="relative w-full">
            <img
                src="/hero.jpeg"
                alt="asuraTECH Solutions — Student, Hosting, ASURA, Cloud"
                className="w-full max-h-[860px] block object-cover"
            />
            {/* smooth transition into next section */}
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute bottom-12 right-8 sm:bottom-16 sm:right-16">
                <a
                    href="#plans"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl shadow-purple-300/40 hover:shadow-2xl hover:shadow-purple-400/50 hover:scale-105 transition-all duration-200"
                >
                    Get Started
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </section>
    );
}
