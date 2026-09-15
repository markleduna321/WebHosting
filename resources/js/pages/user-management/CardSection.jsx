import React from 'react';
import Card from '@/components/ui/Card'; // Adjust import path if needed

const STATS_DATA = [
  { label: 'ACTIVE', count: 7 },
  { label: 'INACTIVE', count: 1 },
  { label: 'SUSPENDED', count: 1 },
  { label: 'PENDING VERIFICATION', count: 1 },
];

export default function CardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_DATA.map((stat, index) => (
        <Card key={index} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {stat.label}
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {stat.count}
          </p>
        </Card>
      ))}
    </div>
  );
}