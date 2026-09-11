import React from 'react'
import Card from '@/components/ui/Card'
import { PLANS } from '../../../data/hostingPlans'

const CURRENT_PLAN_NAME = "Pro";

export default function HostPlanCardSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PLANS.map((plan) => {
        const isCurrent = plan.name === CURRENT_PLAN_NAME;

        return (
          <Card
            key={plan.name}
            variant={isCurrent ? "primary" : "default"}
            outlined={isCurrent}
            padding="p-6"
            className={`justify-between h-full bg-white cursor-default hover:shadow-none ${
              isCurrent ? "border-blue-500 border-2" : "border-gray-200"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400">{plan.subtitle}</p>
                </div>
                {isCurrent && (
                  <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Current
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="my-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                {plan.billingNote && (
                  <span className="text-sm text-gray-500">{plan.billingNote}</span>
                )}
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Features List */}
              <ul className="space-y-3 my-6 text-xs text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button
              className={`w-full py-2.5 rounded-md text-xs font-semibold transition ${
                isCurrent
                  ? "border border-gray-200 text-gray-500 cursor-not-allowed bg-transparent"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={isCurrent}
            >
              {isCurrent ? "Active plan" : plan.cta}
            </button>
          </Card>
        );
      })}
    </div>
  )
}


