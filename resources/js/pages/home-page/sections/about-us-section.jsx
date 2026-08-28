import React from 'react'
import { LayoutGrid, Users, CloudUpload, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: "01",
    icon: <LayoutGrid className="w-5 h-5 text-slate-900 dark:text-white" />,
    title: "Choose Your Plan",
    description: "Select the hosting plan that fits your project.",
  },
  {
    number: "02",
    icon: <Users className="w-5 h-5 text-slate-900 dark:text-white" />,
    title: "Create Your Account",
    description: "Sign up and configure your hosting environment.",
  },
  {
    number: "03",
    icon: <CloudUpload className="w-5 h-5 text-slate-900 dark:text-white" />,
    title: "Launch Your Website",
    description: "Upload or deploy your project and make it available online.",
  },
]

export default function AboutUsSection() {
  return (
    <>
      <section id="about-us" className="scroll-mt-16 bg-slate-50/50 dark:bg-slate-950 py-28 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Live in three steps
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400 sm:text-xl">
              No server configuration, no waiting on IT — most students are online in under ten minutes.
            </p>
          </div>

          {/* Numbered connector row */}
          <div className="flex items-center mb-8">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.number}>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-base font-bold text-blue-600 dark:text-blue-400">
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700 mx-3" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.number}>
                <div className="flex items-center gap-2.5 mb-2">
                  {step.icon}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                </div>
                <p className="text-base text-slate-500 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <div className="bg-white dark:bg-slate-950 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-10 py-16 sm:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1.5px, transparent 1.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to launch your project?
                </h3>
                <p className="mt-4 max-w-lg text-lg text-slate-300">
                  Start hosting your website today with affordable plans made for students.
                </p>
              </div>

              <div className="flex shrink-0 gap-4">
                <a
                  href="#get-started"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-8 py-4 text-lg font-semibold text-white transition-all duration-150"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#hosting-plans"
                  className="inline-flex items-center rounded-xl border border-white/20 hover:bg-white/10 active:scale-[0.98] px-8 py-4 text-lg font-semibold text-white transition-all duration-150"
                >
                  View Plans
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
