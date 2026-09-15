import React from 'react';
import Card from '@/components/Card';

const ATTENTION_ITEMS = [
    { id: 'failed_payments', label: 'Failed or pending payments', count: 2 },
    { id: 'suspended', label: 'Suspended accounts', count: 1 },
    { id: 'verification', label: 'Awaiting verification', count: 1 },
    { id: 'active_subs', label: 'Active subscriptions in workspace', count: 5 },
    { id: 'unread_notifs', label: 'Unread system notifications', count: 4 },
];

export default function NeedsAttentionSection() {
    return (
        <Card className="flex h-full flex-col justify-between">
            <div>
                <h2 className="text-sm font-bold text-slate-900">Needs attention</h2>
                <p className="text-xs text-slate-400 mt-0.5 mb-2">Operational and revenue risks</p>

                <div className="divide-y divide-slate-100">
                    {ATTENTION_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="py-3 flex justify-between items-center text-xs"
                        >
                            <span className="text-slate-600 font-medium">{item.label}</span>
                            <span className="font-bold text-slate-900 text-sm">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}