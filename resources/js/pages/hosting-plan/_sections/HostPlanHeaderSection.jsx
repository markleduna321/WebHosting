import React from 'react'
import { CreditCard } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HostPlanHeaderSection() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Current subscription</p>
          <p className="text-lg font-bold text-slate-900">Student Pro</p>
          <p className="text-xs text-slate-500 mt-1">
            Compare plans below and switch anytime — changes apply on your next billing date.
          </p>
        </div>

        <Button
          variant="light"
          size="md"
          outlined
          className="rounded-lg gap-1.5 shrink-0"
        >
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          Manage billing
        </Button>
      </div>
    </div>
  )
}

