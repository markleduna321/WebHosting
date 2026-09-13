import React, { useState } from 'react'
import { Database, Eye, EyeOff, Copy, RefreshCw, Check } from 'lucide-react'
import Card from '@/components/Card'

const sampleDatabases = [
  {
    id: '1',
    name: 'portfolio_prod',
    type: 'MySQL',
    project: 'Portfolio 2026',
    status: 'Online',
    usedStorageMB: 84,
    totalStorageMB: 1024,
    host: 'mysql-01.asuratechhost.app',
    user: 'mariaclara',
    connectionString: 'mysql://mariaclara:***@mysql-01.asuratechhost.app:3306/portfolio_prod',
  },
  {
    id: '2',
    name: 'traffic_model',
    type: 'PostgreSQL',
    project: 'CS Thesis — Traffic Model',
    status: 'Online',
    usedStorageMB: 612,
    totalStorageMB: 2048,
    host: 'pg-03.asuratechhost.app',
    user: 'thesis_rw',
    connectionString: 'postgres://thesis_rw:***@pg-03.asuratechhost.app:5432/traffic_model',
  },
  {
    id: '3',
    name: 'acm_events',
    type: 'MySQL',
    project: 'ACM Student Chapter',
    status: 'Provisioning',
    usedStorageMB: 0,
    totalStorageMB: 1024,
    host: 'mysql-02.asuratechhost.app',
    user: 'acm_admin',
    connectionString: 'mysql://acm_admin:***@mysql-02.asuratechhost.app:3306/acm_events',
  },
]

export default function DatabaseCardSection() {
  const [showCredentials, setShowCredentials] = useState({})
  const [copiedId, setCopiedId] = useState(null)

  const toggleCredentials = (id) => {
    setShowCredentials((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleDatabases.map((db) => {
          const usagePercent = Math.min(
            100,
            Math.round((db.usedStorageMB / db.totalStorageMB) * 100)
          )
          const isRevealed = !!showCredentials[db.id]

          return (
            <Card
              key={db.id}
              className="justify-between cursor-default"
            >
              {/* Card Body */}
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-base font-bold text-slate-800 leading-tight">
                        {db.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {db.type} · {db.project}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {db.status === 'Online' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Provisioning
                    </span>
                  )}
                </div>

                {/* Storage Bar */}
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
                    <span>Storage</span>
                    <span className="font-semibold text-slate-700">
                      {db.usedStorageMB} / {db.totalStorageMB} MB
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                {/* Database Details */}
                <div className="bg-slate-50/70 rounded-xl p-3.5 space-y-2 text-xs font-mono text-slate-600 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-slate-400">Host</span>
                    <span className="text-slate-700 font-medium">{db.host}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-slate-400">User</span>
                    <span className="text-slate-700 font-medium">{db.user}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-slate-400">Password</span>
                    <span className="text-slate-700 font-semibold tracking-wider">
                      {isRevealed ? 'P@ssw0rd123!' : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => toggleCredentials(db.id)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                      Hide credentials
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Reveal credentials
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(db.id, db.connectionString)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {copiedId === db.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      Copy connection string
                    </>
                  )}
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}