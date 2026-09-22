import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PackageOpen } from 'lucide-react'
import Card from '@/components/ui/Card'
import { formatCurrency } from '../../../data/hostingPlans'

const priceLabel = (plan) => plan.price

const billingNote = (plan) => plan.billingNote

const annualNote = (plan) => plan.annualNote

const ctaLabel = (plan) => plan.cta

export default function HostPlanCardSection({ plans = [] }) {
  const { auth } = usePage().props
  const currentSlug = auth?.user?.plan?.slug ?? null

  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <PackageOpen aria-hidden="true" className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-semibold text-slate-900">
          No plans available
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Hosting plans aren&apos;t published yet. Please check back shortly.
        </p>
        <Link
          href="/support"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Contact support
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrent = plan.slug === currentSlug

        return (
          <Card
            key={plan.slug}
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
                {isCurrent ? (
                  <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Current
                  </span>
                ) : (
                  plan.popular && (
                    <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      Popular
                    </span>
                  )
                )}
              </div>

              {/* Pricing */}
              <div className="my-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {priceLabel(plan)}
                </span>
                {billingNote(plan) && (
                  <span className="text-sm text-gray-500">{billingNote(plan)}</span>
                )}
                <p className="mt-1 text-xs text-gray-400">{annualNote(plan)}</p>
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
            {isCurrent ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-md text-xs font-semibold border border-gray-200 text-gray-500 cursor-not-allowed bg-transparent"
              >
                Active plan
              </button>
            ) : (
              <Link
                href={
                  plan.monthlyPrice !== null
                    ? `/checkout/${plan.slug}`
                    : "/support"
                }
                className="block w-full rounded-md bg-blue-600 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                {ctaLabel(plan)}
              </Link>
            )}
          </Card>
        );
      })}
    </div>
  )
}


