import { useState } from 'react';

const PLANS = [
    {
        name: 'Starter',
        price: 100,
        badge: 'Entry Level',
        badgeStyle: 'bg-gray-100 text-gray-600',
        features: ['Fixed features', 'Basic support', 'Easy to scale', 'Cloud storage'],
        details: ['1 Website', '10 GB SSD Storage', '100 GB Bandwidth', 'Free SSL Certificate', '5 Email Accounts', '99.9% Uptime SLA'],
    },
    {
        name: 'Basic',
        price: 150,
        badge: 'Popular',
        badgeStyle: 'bg-indigo-100 text-indigo-700',
        features: ['Fixed features', 'Priority support', 'Easy to price', 'Cloud features'],
        details: ['5 Websites', '25 GB SSD Storage', '500 GB Bandwidth', 'Free SSL', '20 Email Accounts', '99.9% Uptime SLA'],
    },
    {
        name: 'Business',
        price: 200,
        badge: 'Most Popular',
        badgeStyle: 'bg-purple-100 text-purple-700',
        features: ['Fixed features', 'Premium features', 'Easy to price', 'Cloud features'],
        details: ['10 Websites', '50 GB SSD Storage', 'Unlimited Bandwidth', 'Free SSL + Wildcard', '50 Email Accounts', '99.99% Uptime SLA'],
    },
    {
        name: 'Pro',
        price: 250,
        badge: 'Advanced',
        badgeStyle: 'bg-violet-100 text-violet-700',
        features: ['Fixed features', 'Premium features', 'Dedicated support', 'Cloud features'],
        details: ['Unlimited Websites', '100 GB SSD Storage', 'Unlimited Bandwidth', 'Free SSL + CDN', 'Unlimited Emails', '99.99% Uptime SLA'],
    },
    {
        name: 'Enterprise',
        price: 300,
        badge: 'Best Value',
        badgeStyle: 'bg-amber-100 text-amber-700',
        features: ['Fixed features', 'Premium features', 'SLA guarantee', 'Cloud features'],
        details: ['Unlimited Websites', '200 GB NVMe Storage', 'Unlimited Bandwidth', 'Free SSL + CDN + WAF', 'Unlimited Emails', '100% Uptime SLA'],
    },
];

// fixed pixel dimensions drive the carousel math
const CARD_W = 320;
const CARD_GAP = 24;

export default function PricingSection() {
    const [active, setActive] = useState(2);
    const [expandedPlan, setExpandedPlan] = useState(null);

    // clamp so the 3-card window never scrolls past the ends
    const offset = Math.max(0, Math.min(PLANS.length - 3, active - 1));
    const translateX = -(offset * (CARD_W + CARD_GAP));

    return (
        <section
            id="plans"
            className="py-20 px-4 bg-gray-50"
            style={{ backgroundImage: 'radial-gradient(#d8b4fe 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">
                        Pricing
                    </span>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                        Plans and Pricing
                    </h2>
                    <p className="mt-2 text-gray-500">Choose the plan that fits your needs</p>
                </div>

                {/* outer wrapper sets width and provides arrow anchor */}
                <div
                    className="relative mx-auto"
                    style={{ maxWidth: `${3 * CARD_W + 2 * CARD_GAP + 96}px` }}
                >
                    <button
                        onClick={() => setActive((p) => Math.max(0, p - 1))}
                        disabled={active === 0}
                        aria-label="Previous plan"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-purple-700 text-xl hover:bg-purple-50 disabled:opacity-30 transition-colors"
                    >
                        ‹
                    </button>

                    {/* py-6 gives room for the active card's scale-105 to breathe */}
                    <div className="overflow-x-hidden mx-12 py-6">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ gap: `${CARD_GAP}px`, transform: `translateX(${translateX}px)` }}
                        >
                            {PLANS.map((plan, i) => {
                                const isActive = i === active;
                                const isExpanded = expandedPlan === plan.name;

                                return (
                                    <div
                                        key={plan.name}
                                        onClick={() => setActive(i)}
                                        style={{ width: `${CARD_W}px`, flexShrink: 0 }}
                                        className={`
                                            rounded-2xl p-7 cursor-pointer transition-all duration-300
                                            ${isActive
                                                ? 'bg-gradient-to-b from-purple-700 to-indigo-600 text-white shadow-2xl scale-105 ring-4 ring-purple-400/30 ring-offset-2'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:shadow-lg opacity-80 hover:opacity-100'}
                                        `}
                                    >
                                        {/* Badge */}
                                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${isActive ? 'bg-white/20 text-white' : plan.badgeStyle}`}>
                                            {plan.badge}
                                        </span>

                                        <p className={`text-sm font-medium ${isActive ? 'text-purple-200' : 'text-gray-500'}`}>
                                            {plan.name} Plan
                                        </p>

                                        <p className={`mt-2 text-4xl font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                            ${plan.price}
                                            <span className={`text-base font-normal ${isActive ? 'text-purple-200' : 'text-gray-400'}`}>/mo</span>
                                        </p>
                                        <p className={`text-xs mt-0.5 ${isActive ? 'text-purple-200' : 'text-gray-400'}`}>
                                            per features
                                        </p>

                                        <ul className="mt-5 space-y-2.5">
                                            {plan.features.map((f) => (
                                                <li key={f} className={`flex items-center gap-2 text-sm ${isActive ? 'text-purple-100' : 'text-gray-600'}`}>
                                                    <span className={`text-base leading-none ${isActive ? 'text-green-300' : 'text-purple-500'}`}>✓</span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Expandable details */}
                                        {isExpanded && (
                                            <ul className={`mt-3 space-y-2 border-t pt-3 ${isActive ? 'border-purple-500/50' : 'border-gray-100'}`}>
                                                {plan.details.map((d) => (
                                                    <li key={d} className={`flex items-center gap-2 text-sm ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                                                        <span className={`text-xs ${isActive ? 'text-purple-300' : 'text-indigo-400'}`}>◆</span>
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedPlan(isExpanded ? null : plan.name); }}
                                            className={`mt-4 w-full py-1.5 rounded-md text-xs font-medium transition-colors ${isActive ? 'text-purple-200 hover:text-white' : 'text-purple-600 hover:text-purple-800'}`}
                                        >
                                            {isExpanded ? '▲ Show less' : '▼ Show more'}
                                        </button>

                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className={`
                                                mt-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors
                                                ${isActive
                                                    ? 'bg-white text-purple-700 hover:bg-purple-50'
                                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'}
                                            `}
                                        >
                                            {isActive ? 'Get Now' : 'Try Now'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={() => setActive((p) => Math.min(PLANS.length - 1, p + 1))}
                        disabled={active === PLANS.length - 1}
                        aria-label="Next plan"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center text-purple-700 text-xl hover:bg-purple-50 disabled:opacity-30 transition-colors"
                    >
                        ›
                    </button>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {PLANS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            aria-label={`Select plan ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${i === active ? 'bg-purple-600 w-6 h-2' : 'bg-gray-300 w-2 h-2'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}


