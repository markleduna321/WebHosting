import React from 'react';
import Card from '@/components/Card';

const SYSTEM_ACTIVITIES = [
    {
        id: '1',
        title: 'mnl-db-01 is critical',
        description: 'RAM at 95% and storage at 88% — investigate before the nightly backup window.',
        time: '6 min ago',
        icon: (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
        ),
    },
    {
        id: '2',
        title: 'Payment failed — Paolo Aguilar',
        description: 'txn-90473 · ₱399.00 · Mastercard •••• 8891 declined.',
        time: '32 min ago',
        icon: (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: '3',
        title: 'Deployment failed — Jeepney Route API',
        description: 'dep-2838 failed after 133s on branch release/2.1.',
        time: '1 hour ago',
        icon: (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        ),
    },
    {
        id: '4',
        title: 'New student registration',
        description: 'Sofia Villanueva (Adamson University) started a Starter trial.',
        time: '3 hours ago',
        icon: (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        id: '5',
        title: 'SSL expiring in 8 days',
        description: 'smartfarm.ph organisation certificate expires 2026-08-22.',
        time: '5 hours ago',
        icon: (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
];

export default function RecentSystemActivitySection() {
    return (
        <Card className="w-full h-full">
            <div className="pb-3 border-b border-slate-100 mb-2">
                <h2 className="text-sm font-bold text-slate-900">Recent system activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Registrations, payments, deployments and server events
                </p>
            </div>

            <div className="divide-y divide-slate-100">
                {SYSTEM_ACTIVITIES.map((activity) => (
                    <div
                        key={activity.id}
                        className="py-3 flex items-start justify-between gap-4 text-xs"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-1.5 rounded-md bg-slate-50 border border-slate-100">
                                {activity.icon}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{activity.title}</div>
                                <div className="text-slate-500 mt-0.5">{activity.description}</div>
                            </div>
                        </div>
                        <span className="text-slate-400 whitespace-nowrap text-[11px]">
                            {activity.time}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}