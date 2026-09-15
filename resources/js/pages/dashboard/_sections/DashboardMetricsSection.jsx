import React from 'react';
import Card from '@/components/Card';

// Static Data Constants
const METRICS_DATA = [
    {
        id: 'subscribers',
        title: 'Total Active Subscribers',
        value: '1,432',
        subtext: '1,148 monthly · 284 yearly',
        badgeColor: 'bg-blue-50 text-blue-600',
        change: {
            value: '6%',
            isPositive: true,
        },
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        id: 'arpu',
        title: 'Average Revenue Per User',
        value: '₱129',
        subtext: '5 plans on sale',
        badgeColor: 'bg-blue-50 text-blue-600',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: 'churn',
        title: 'Monthly Churn',
        value: '2.1%',
        subtext: 'Improving for 5 months',
        badgeColor: 'bg-emerald-50 text-emerald-600',
        change: {
            value: '0.2%',
            isPositive: false,
        },
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
        ),
    },
    {
        id: 'trials',
        title: 'Trials in Progress',
        value: '96',
        subtext: '14 failed payments to review',
        badgeColor: 'bg-amber-50 text-amber-600',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
        ),
    },
];

export default function DashboardMetricsSection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {METRICS_DATA.map((metric) => (
                <Card key={metric.id} className="flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            {metric.title}
                        </span>
                        <div className={`p-2 rounded-lg ${metric.badgeColor}`}>
                            {metric.icon}
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 tracking-tight">
                            {metric.value}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                            {metric.change && (
                                <span
                                    className={`flex items-center gap-0.5 ${
                                        metric.change.isPositive ? 'text-emerald-600' : 'text-rose-500'
                                    }`}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2.5"
                                            d={
                                                metric.change.isPositive
                                                    ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                                                    : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
                                            }
                                        />
                                    </svg>
                                    {metric.change.value}
                                </span>
                            )}
                            <span>{metric.subtext}</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}