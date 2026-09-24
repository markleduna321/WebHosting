import React from "react";
import { Head } from "@inertiajs/react";
import NavBarSection from "../home-page/_sections/NavBarSection";

export default function Page() {
    return (
        <div>
            <NavBarSection />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
                <Head title="Terms of Service — CALEHO Host" />
                <div className="max-w-6xl mx-auto">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Terms of Service
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Last Updated: September 22, 2026
                        </p>

                        <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                            These Terms of Service ("Terms") govern your access
                            to and use of CALEHO Host's web hosting, domain, and
                            cloud services. By using our services, you agree to
                            these Terms.
                        </p>
                    </div>

                    <main className="bg-white dark:bg-slate-900/30 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-10">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                By creating an account or using any CALEHO Host
                                service, you confirm that you have read,
                                understood, and agree to be bound by these Terms
                                and our Privacy Policy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                2. Account Responsibilities
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                You are responsible for maintaining the
                                confidentiality of your account credentials and
                                for all activity that occurs under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                3. Acceptable Use
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                You agree not to use our services for any
                                unlawful purpose, to distribute malware, or to
                                engage in activity that disrupts or abuses our
                                infrastructure or other users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                4. Billing & Subscription Expiration
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                Subscriptions are billed according to the plan
                                selected. Plans are valid only for their
                                specified subscription period. Once a plan
                                expires, access to the subscribed features and
                                services will end, and the expired plan will no
                                longer be available. To continue using the
                                services, users must renew their subscription or
                                subscribe to a new plan.{" "}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                5. Termination
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                We reserve the right to suspend or terminate
                                accounts that violate these Terms or pose a
                                security risk to our platform or other users.
                            </p>
                        </section>

                        <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                6. Contact Us
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                Questions about these Terms can be sent to:
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm space-y-1">
                                <p className="text-slate-900 dark:text-white font-medium">
                                    Caleho Cloud Support
                                </p>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Email:{" "}
                                    <a
                                        href="mailto:support@caleho.cloud"
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
                                    >
                                        support@caleho.cloud
                                    </a>
                                </p>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
