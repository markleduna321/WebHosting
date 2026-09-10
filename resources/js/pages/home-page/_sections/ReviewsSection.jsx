const REVIEWS = [
    {
        name: 'Amara Osei',
        role: 'Student Developer',
        avatar: 'AO',
        rating: 5,
        text: 'asuraTECH hosting made it incredibly easy to deploy my first project. The cloud features are powerful yet affordable for students.',
    },
    {
        name: 'Liam Patel',
        role: 'Freelance Designer',
        avatar: 'LP',
        rating: 5,
        text: 'Migrated three client sites here and the uptime has been flawless. The Business plan gives you everything you need at a fair price.',
    },
    {
        name: 'Sofia Mensah',
        role: 'E-commerce Owner',
        avatar: 'SM',
        rating: 4,
        text: 'Support team is responsive and genuinely helpful. Setup was quick and the SSL was provisioned instantly.',
    },
    {
        name: 'James Kweku',
        role: 'Tech Lead',
        avatar: 'JK',
        rating: 5,
        text: 'Moved our entire infrastructure to asuraTECH Enterprise. The NVMe storage and CDN combo has noticeably improved our load times.',
    },
    {
        name: 'Priya Nkrumah',
        role: 'Startup Founder',
        avatar: 'PN',
        rating: 5,
        text: 'The pricing is transparent with no hidden fees. Scaling up from Starter to Pro was seamless — no downtime at all.',
    },
    {
        name: 'Kofi Asante',
        role: 'WordPress Developer',
        avatar: 'KA',
        rating: 4,
        text: 'Dashboard is clean and intuitive. Deploying WordPress took under five minutes and performance has been consistently great.',
    },
];

function Stars({ count }) {
    return (
        <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < count ? 'text-amber-400' : 'text-gray-200'}>
                    ★
                </span>
            ))}
        </div>
    );
}

export default function ReviewsSection() {
    return (
        <section id="reviews" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">
                        Testimonials
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
                    <p className="mt-2 text-gray-500">Real feedback from real asuraTECH users</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {REVIEWS.map((review) => (
                        <div
                            key={review.name}
                            className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50 transition-all duration-300 flex flex-col gap-4 overflow-hidden"
                        >
                            {/* Decorative oversized quote mark */}
                            <span className="pointer-events-none absolute -top-2 left-4 text-7xl leading-none font-serif text-purple-100 select-none" aria-hidden="true">
                                &ldquo;
                            </span>

                            <div className="relative">
                                <Stars count={review.rating} />
                            </div>

                            <p className="relative text-gray-600 text-sm leading-relaxed flex-1">
                                {review.text}
                            </p>

                            <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-purple-200">
                                    {review.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                                    <p className="text-xs text-gray-400">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
