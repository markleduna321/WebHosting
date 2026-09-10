const STATS = [
    { value: '10,000+', label: 'Sites Hosted' },
    { value: '99.99%', label: 'Uptime Guaranteed' },
    { value: '24 / 7', label: 'Expert Support' },
    { value: '50+',    label: 'Countries Served' },
];

export default function StatsBar() {
    return (
        <div className="relative bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-1 px-6 py-4">
                            <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                                {stat.value}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
