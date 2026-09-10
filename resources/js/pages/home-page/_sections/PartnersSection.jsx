const PARTNERS = [
    'Google Cloud', 'AWS', 'Cloudflare', 'GitHub',
    'DigitalOcean', 'Vercel', 'Stripe', 'Twilio',
];

export default function PartnersSection() {
    return (
        <section id="partners" className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center mb-12">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">
                    Partners
                </span>
                <h2 className="text-3xl font-bold text-gray-900">Trusted by Leading Companies</h2>
                <p className="mt-2 text-gray-500">Powering businesses from startups to enterprises</p>
            </div>

            {/* Auto-scrolling marquee */}
            <div className="relative w-full">
                {/* Edge fade masks */}
                <div className="pointer-events-none absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                {/* duplicated list creates seamless infinite loop */}
                <div className="flex animate-marquee gap-6" style={{ width: 'max-content' }}>
                    {[...PARTNERS, ...PARTNERS].map((name, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-44 h-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-400 hover:border-purple-200 hover:text-purple-500 transition-colors"
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
