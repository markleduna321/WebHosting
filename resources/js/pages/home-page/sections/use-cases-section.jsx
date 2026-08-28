import React from 'react'
import { GraduationCap, Briefcase, Rocket, Users, Code2, BookOpen } from 'lucide-react'

export default function UseCasesSection() {
  const cases = [
    {
      icon: <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Personal Portfolios",
      description: "Show your work to recruiters on a custom domain that looks professional."
    },
    {
      icon: <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Startup Projects",
      description: "Validate your idea with a landing page and scale up when traction arrives."
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Student Organizations",
      description: "Run event pages, member sign-ups, and announcements from one place."
    },
    {
      icon: <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Coding & Development",
      description: "Push from Git, connect a database, and run staging and production side by side."
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Built for students, projects &amp; ideas
          </h2>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            From a first HTML assignment to a funded startup demo — the same account grows with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured card, spans both rows of the left column */}
          <div className="md:row-span-2 rounded-2xl bg-slate-900 p-8 flex flex-col">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 mb-4">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">School Projects</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Publish class assignments with a link your professor can open on any device.
            </p>

            <div className="mt-auto pt-8">
              <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">Projects Hosted</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">18,420</p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">Campuses</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">126</p>
                </div>
              </div>
            </div>
          </div>

          {cases.map((item, index) => (
            <div key={index} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
          ))}

          {/* Placed last so grid auto-flow drops it under the featured card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thesis &amp; Research</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Host research sites, datasets, and documentation with reliable uptime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
