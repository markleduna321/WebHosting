import React, { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'
import NavBarSection from '../home-page/_sections/NavBarSection'

export default function Page() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: '1. Overview' },
    { id: 'information-collected', label: '2. Information We Collect' },
    { id: 'how-we-use-info', label: '3. How We Use Information' },
    { id: 'data-storage', label: '4. Data Storage & Security' },
    { id: 'third-party', label: '5. Third-Party Services' },
    { id: 'cookies', label: '6. Cookies & Tracking' },
    { id: 'user-rights', label: '7. Your Data Rights' },
    { id: 'contact', label: '8. Contact Us' },
  ]

  // Automatically update the active section while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting)

        if (visibleSection) {
          setActiveSection(visibleSection.target.id)
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)

      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    setActiveSection(id)

    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div>
        <NavBarSection/>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <Head title="Privacy Policy — CALEHO Host" />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last Updated: September 22, 2026
          </p>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            This Privacy Policy describes how CALEHO Host ("we", "us", or
            "our") collects, uses, and safeguards your personal and technical
            data when you use our web hosting, domain, and cloud services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8">
              <nav className="space-y-1 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-3">
                  Contents
                </p>

                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollTo(section.id)}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 bg-white dark:bg-slate-900/30 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80">

            {/* Section 1 */}
            <section
              id="overview"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                1. Overview
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                At CALEHO Host, we are committed to maintaining the trust and
                confidence of our users. We do not sell, rent, or trade email
                lists or personal user data with other companies and businesses
                for marketing purposes. This policy explains in detail when and
                why we collect personal information, how we use it, and how we
                keep it secure.
              </p>
            </section>

            {/* Section 2 */}
            <section
              id="information-collected"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                2. Information We Collect
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We collect information to provide better services to all our
                users. The types of information we collect include:
              </p>

              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Account Data:</strong>{' '}
                  Name, email address, billing address, phone number, and
                  account credentials when you register.
                </li>

                <li>
                  <strong className="text-slate-900 dark:text-white">Hosting &amp; Server Data:</strong>{' '}
                  IP addresses, server logs, resource usage metrics,
                  deployment configurations, and system usage statistics.
                </li>

                <li>
                  <strong className="text-slate-900 dark:text-white">Payment Information:</strong>{' '}
                  Transaction details, invoice history, and billing references
                  processed securely via third-party gateways.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section
              id="how-we-use-info"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                3. How We Use Information
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We use the information we collect strictly for operating,
                maintaining, and improving our hosting infrastructure:
              </p>

              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-2">
                <li>
                  Provisioning, maintaining, and managing your hosting
                  environments and services.
                </li>

                <li>
                  Processing transactions and sending billing notifications
                  or order confirmations.
                </li>

                <li>
                  Detecting, preventing, and mitigating security threats,
                  DDoS attacks, or server abuse.
                </li>

                <li>
                  Providing customer support and technical troubleshooting.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section
              id="data-storage"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                4. Data Storage &amp; Security
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We implement industry-standard administrative, physical, and
                technical security measures, including SSL/TLS encryption,
                firewall protection, and restricted database access, to protect
                your personal information and hosted assets from unauthorized
                access, alteration, or destruction.
              </p>
            </section>

            {/* Section 5 */}
            <section
              id="third-party"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                5. Third-Party Services
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We may employ third-party service providers, such as payment
                processors, DNS routing networks, or domain registries, to
                facilitate our services. These third parties have access to
                your personal data only to perform specific tasks on our behalf
                and are obligated not to disclose or use it for any other
                purpose.
              </p>
            </section>

            {/* Section 6 */}
            <section
              id="cookies"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                6. Cookies &amp; Tracking Technologies
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We use essential cookies and session storage mechanisms strictly
                required for user authentication, dashboard session
                persistence, and maintaining security configurations across the
                dashboard.
              </p>
            </section>

            {/* Section 7 */}
            <section
              id="user-rights"
              className="scroll-mt-8 pb-12"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                7. Your Data Rights
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Depending on your location, you may have specific rights
                regarding your personal information, including:
              </p>

              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-2">
                <li>
                  The right to access, update, or delete the information we
                  have on you.
                </li>

                <li>
                  The right to rectify inaccurate or incomplete information.
                </li>

                <li>
                  The right to request data export or account closure.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section
              id="contact"
              className="scroll-mt-8 pt-8 border-t border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                8. Contact Us
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please get in touch with us:
              </p>

              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm space-y-1">
                <p className="text-slate-900 dark:text-white font-medium">
                  Caleho Cloud Support
                </p>

                <p className="text-slate-500 dark:text-slate-400">
                  Email:{' '}
                  <a
                    href="mailto:support@caleho.cloud"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
                  >
                    support@caleho.cloud
                  </a>
                </p>

                <p className="text-slate-500 dark:text-slate-400">
                  Website:{' '}
                  <a
                    href="https://www.caleho.cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
                  >
                    caleho.cloud
                  </a>
                </p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
    </div>
    
  )
}