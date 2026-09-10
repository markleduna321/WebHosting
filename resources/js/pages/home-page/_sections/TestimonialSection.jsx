import React from 'react'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: "Harsh Chopda",
    handle: "@__harsh__43",
    quote: "Their hosting streamlined our capstone deployment and cut our submission scramble down to a single link.",
    date: "Jan 04, 2024",
    time: "03:45 PM",
    meta: "CS student · Manila",
    seed: "Harsh Chopda",
    bg: "b6e3f4",
  },
  {
    name: "Emma Brown",
    handle: "@_.emma_",
    quote: "Outstanding results. My portfolio went live on a custom domain in an afternoon and recruiters actually reply now.",
    date: "Dec 26, 2023",
    time: "08:21 AM",
    meta: "Design major · Leeds",
    seed: "Emma Brown",
    bg: "d1d4f9",
  },
  {
    name: "James Anderson",
    handle: "@james_12",
    quote: "Highly recommend their tooling — Git deploys made our workflow much smoother and far more efficient.",
    date: "Dec 18, 2023",
    time: "11:07 AM",
    meta: "Startup founder · Austin",
    seed: "James Anderson",
    bg: "ffd5cc",
  },
  {
    name: "Aisha Bello",
    handle: "@aisha.codes",
    quote: "We run event pages and member sign-ups for the whole club from one dashboard. No server headaches at all.",
    date: "Dec 09, 2023",
    time: "06:52 PM",
    meta: "Org president · Lagos",
    seed: "Aisha Bello",
    bg: "c0f2d1",
  },
  {
    name: "Mika Tanaka",
    handle: "@mika_dev",
    quote: "My research site and dataset docs have stayed online through every deadline. Uptime I never have to think about.",
    date: "Nov 28, 2023",
    time: "09:15 AM",
    meta: "Grad researcher · Osaka",
    seed: "Mika Tanaka",
    bg: "c7ddf9",
  },
  {
    name: "Leo Marchetti",
    handle: "@leomarch",
    quote: "Staging and production side by side for student pricing. It taught me more about shipping than any lecture.",
    date: "Nov 14, 2023",
    time: "04:33 PM",
    meta: "Developer · Milan",
    seed: "Leo Marchetti",
    bg: "fde7b8",
  },
]

const PARTNERS = [
  { initials: "NC", name: "NimbusCore", role: "Infrastructure" },
  { initials: "NE", name: "NorthEdge CDN", role: "Content delivery" },
  { initials: "BD", name: "Bayanihan Data", role: "Managed databases" },
  { initials: "CP", name: "CertPoint", role: "SSL authority" },
  { initials: "OR", name: "Orbit Registry", role: "Domain registrar" },
  { initials: "KP", name: "Kalikasan Power", role: "Green data centers" },
  { initials: "DS", name: "DevSuite", role: "CI/CD pipelines" },
  { initials: "SS", name: "Sentinel Shield", role: "DDoS protection" },
]

export default function TestimonialSection() {
  return (
    <section className="bg-slate-50/50 dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
            Testimonial
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            What Our Clients Are Saying
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20">
          {TESTIMONIALS.map((item) => (
            <div key={item.handle} className="group">
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 pt-14 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.seed)}&backgroundColor=${item.bg}`}
                  alt={item.name}
                  className="absolute -top-9 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full ring-4 ring-slate-50 dark:ring-slate-950 transition-transform duration-300 group-hover:scale-110"
                />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-base font-medium text-blue-600 dark:text-blue-400">
                  {item.handle}
                </p>

                <Quote className="mx-auto mt-4 mb-3 h-5 w-5 text-slate-300 dark:text-slate-700" fill="currentColor" />

                <p className="text-base leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.quote}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 text-sm text-slate-400 dark:text-slate-500">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-slate-400 dark:text-slate-500">
                {item.meta}
              </p>
            </div>
          ))}
        </div>

        {/* Technology Partners */}
        <div id="partners" className="mt-32 scroll-mt-16 border-t border-slate-100 dark:border-slate-800 pt-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Powered by trusted technology partners
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            We work with reliable technology and infrastructure partners to provide students with dependable hosting services.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left transition-colors duration-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {partner.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{partner.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{partner.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
