import React from 'react'
import { Zap, Lock, Tag, CloudUpload, Terminal, Headset } from 'lucide-react'

export default function FeatureSection() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Fast & Reliable Hosting",
      description: "Fast-loading hosting optimized for student websites and projects."
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Free SSL Certificate",
      description: "Keep student websites secure with HTTPS included."
    },
    {
      icon: <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Student-Friendly Pricing",
      description: "Affordable plans designed around student budgets."
    },
    {
      icon: <CloudUpload className="w-5 h-5 text-blue-600 dark:text-blue-400" />,   
      title: "Easy Website Deployment",
      description: "Deploy websites and projects without complicated server configuration."
    },
    {
      icon: <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Developer Tools",
      description: "Support for Git, databases, development environments, and modern web projects."
    },
    {
      icon: <Headset className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "24/7 Support",
      description: "Get assistance whenever you encounter hosting or deployment issues."
    }
  ]

  // Static location pins overlaid on the dome (positions are % of the rotating 1000x1000 layer)
  const flags = [
    { code: "ph", left: "48%", top: "31%" },
    { code: "us", left: "20%", top: "22.5%" },
    { code: "ca", left: "78%", top: "21%" },
    { code: "jp", left: "62%", top: "10%" },
    { code: "gb", left: "35%", top: "11%" },
    { code: "it", left: "85%", top: "30%" },
  ]

  return (
    <section id="features" className="relative overflow-hidden scroll-mt-16 bg-slate-50/50 dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Background Graphic: slowly spinning wireframe globe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-24 flex justify-center"
      >
        <div className="relative h-[500px] w-[1000px] overflow-hidden rounded-t-full bg-gradient-to-b from-blue-100/70 dark:from-blue-900/30 to-transparent">
          {/* rotates clockwise; wireframe + flag pins orbit together so the spin reads clearly */}
          <div className="absolute left-0 top-0 h-[1000px] w-[1000px] animate-[spin_70s_linear_infinite]">
            <svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 h-full w-full text-blue-400/70 dark:text-blue-500/40"
            >
              {/* longitude/latitude rings double as the globe's wireframe */}
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="500" cy="500" r="498" strokeDasharray="2 10" />
                <ellipse cx="500" cy="500" rx="498" ry="188" strokeDasharray="2 10" />
                <ellipse cx="500" cy="500" rx="498" ry="338" strokeDasharray="2 10" />
                <ellipse cx="500" cy="500" rx="188" ry="498" strokeDasharray="2 10" />
                <ellipse cx="500" cy="500" rx="338" ry="498" strokeDasharray="2 10" />
              </g>
            </svg>

            {flags.map((flag) => (
              <img
                key={flag.code}
                src={`https://flagcdn.com/w40/${flag.code}.png`}
                alt=""
                className="absolute h-5 w-7 rounded-sm object-cover shadow-sm ring-1 ring-white/60"
                style={{ left: flag.left, top: flag.top }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to build online
          </h2>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            Hosting essentials, developer tooling, and real human support — bundled at a price a student can actually pay.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}