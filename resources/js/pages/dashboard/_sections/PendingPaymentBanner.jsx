import { AlertCircle, ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "@inertiajs/react";

export default function PendingPaymentBanner({ subscription }) {
    if (!subscription || subscription.status !== "pending_payment") {
        return null;
    }

    // We can infer the plan slug from the subscription relation if it's eager loaded, 
    // or just direct them to the generic hosting plan page if not.
    // Assuming the user has a plan loaded.
    const planSlug = subscription.plan?.slug;
    const cycle = subscription.billing_cycle || "monthly";

    const checkoutUrl = planSlug 
        ? `/checkout/${planSlug}?cycle=${cycle}` 
        : "/hosting";

    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                        <h3 className="text-sm font-semibold text-amber-900">
                            Complete your payment
                        </h3>
                        <p className="mt-1 text-sm text-amber-700">
                            You need to complete your payment to activate your {subscription.plan?.name || "hosting"} plan and start deploying sites.
                        </p>
                    </div>
                </div>
                
                <Link
                    href={checkoutUrl}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shrink-0"
                >
                    Pay now
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
