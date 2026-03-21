'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Scale,
  LogOut,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Briefcase,
  TrendingUp,
  Eye,
  ChevronDown,
  Search,
  Filter,
  Download,
  Activity,
  Shield,
  BarChart3,
} from 'lucide-react'

type Case = {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
  document_type?: string
  plaintiff_name?: string
  defendant_name?: string
  amount?: number
  created_at: string
  updated_at: string
  plaintiff?: {
    id: string
    email: string
  }
}

type Stats = {
  total: number
  open: number
  inProgress: number
  resolved: number
}

const STATUS_CONFIG = {
  OPEN: { label: 'Ouvert', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'En cours', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  RESOLVED: { label: 'Résolu', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
}

const DOC_TYPE_LABELS: Record<string, string> = {
  mise_en_demeure: 'Mise en Demeure | إعذار',
  injonction_payer: 'Injonction de Payer | أمر بالأداء',
  litige_travail: 'Litige du Travail | نزاع عمل',
  default: 'Requête générale',
}

export default function AdminDashboard() {
  const router = useRouter()

  const [cases, setCases] = useState<Case[]>([])
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, inProgress: 0, resolved: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3500)
  }

  const checkAuth = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    if (!res.ok) { router.replace('/login'); return }
    const { user } = await res.json()
    if (!user || user.role !== 'ADMIN') { router.replace('/login'); return }
    setIsAuthorized(true)
    setAdminEmail(user.email || '')
    fetchCases()
  }, [router])

  const fetchCases = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/cases')
      const data = await res.json()
      const casesData: Case[] = data.cases || []
      setCases(casesData)
      setFilteredCases(casesData)
      setStats({
        total: casesData.length,
        open: casesData.filter(c => c.status === 'OPEN').length,
        inProgress: casesData.filter(c => c.status === 'IN_PROGRESS').length,
        resolved: casesData.filter(c => c.status === 'RESOLVED').length,
      })
    } catch {
      showNotification('error', 'Erreur lors du chargement des dossiers.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Filter cases when search/filter changes
  useEffect(() => {
    let result = cases
    if (statusFilter !== 'ALL') {
      result = result.filter(c => c.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.plaintiff?.email?.toLowerCase().includes(q) ||
        c.plaintiff_name?.toLowerCase().includes(q) ||
        c.defendant_name?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      )
    }
    setFilteredCases(result)
  }, [searchQuery, statusFilter, cases])

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    setIsUpdating(caseId)
    try {
      const res = await fetch('/api/admin/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      showNotification('success', 'Statut mis à jour avec succès.')
      fetchCases()
      setSelectedCase(null)
    } catch {
      showNotification('error', 'Échec de la mise à jour du statut.')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-DZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isAuthorized && !isLoading) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100'
            : 'bg-red-900/90 border-red-700 text-red-100'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scale className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-lg leading-none">Dhikra</h1>
              <p className="text-amber-500 text-xs font-semibold tracking-wider uppercase mt-0.5">Admin Central</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: BarChart3, label: 'Vue d\'ensemble', active: true },
            { icon: FileText, label: 'Tous les dossiers', active: false },
            { icon: Users, label: 'Utilisateurs', active: false },
            { icon: Activity, label: 'Activité', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Admin Info + Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-slate-900" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-400">Connecté en tant que</p>
              <p className="text-sm font-semibold text-white truncate">{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all border border-transparent hover:border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Tableau de Bord Administrateur</h2>
            <p className="text-slate-400 text-sm">Gestion centralisée de tous les dossiers juridiques</p>
          </div>
          <button
            onClick={fetchCases}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Total Dossiers', value: stats.total, icon: Briefcase, color: 'from-slate-700 to-slate-800', iconColor: 'text-slate-300' },
              { label: 'Ouverts', value: stats.open, icon: Clock, color: 'from-blue-900/50 to-slate-900', iconColor: 'text-blue-400', badge: 'rgb(59,130,246)' },
              { label: 'En cours', value: stats.inProgress, icon: TrendingUp, color: 'from-amber-900/50 to-slate-900', iconColor: 'text-amber-400' },
              { label: 'Résolus', value: stats.resolved, icon: CheckCircle, color: 'from-emerald-900/50 to-slate-900', iconColor: 'text-emerald-400' },
            ].map(({ label, value, icon: Icon, color, iconColor }) => (
              <div key={label} className={`relative rounded-2xl bg-gradient-to-br ${color} border border-slate-800 p-5 overflow-hidden`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
                    <p className="text-4xl font-black text-white">{isLoading ? '—' : value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/5 ${iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                {stats.total > 0 && !isLoading && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-current opacity-50 transition-all duration-500"
                        style={{ width: `${Math.round((value / stats.total) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {Math.round((value / stats.total) * 100)}% du total
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par ID, email, nom..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-all"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="OPEN">Ouverts</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="RESOLVED">Résolus</option>
                <option value="REJECTED">Rejetés</option>
              </select>
            </div>
            <p className="text-slate-500 text-sm ml-auto">{filteredCases.length} dossier(s)</p>
          </div>

          {/* Cases Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Dossiers Juridiques
              </h3>
              <button className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <Download className="w-3.5 h-3.5" />
                Exporter
              </button>
            </div>

            {isLoading ? (
              <div className="p-16 flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-slate-400 text-sm">Chargement des dossiers...</p>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="p-16 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">Aucun dossier trouvé</p>
                <p className="text-slate-600 text-sm text-center max-w-xs">
                  {cases.length === 0
                    ? 'Aucune requête soumise par les utilisateurs pour le moment.'
                    : 'Aucun dossier ne correspond à vos critères de recherche.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {filteredCases.map(c => {
                  const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.OPEN
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Status Dot */}
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white text-sm truncate">
                            {c.title || DOC_TYPE_LABELS[c.document_type || ''] || DOC_TYPE_LABELS.default}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-mono">{c.id.slice(0, 8)}...</span>
                          {c.plaintiff?.email && (
                            <>
                              <span>·</span>
                              <span>{c.plaintiff.email}</span>
                            </>
                          )}
                          {c.plaintiff_name && (
                            <>
                              <span>·</span>
                              <span>Plaignant: {c.plaintiff_name}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-slate-500">{formatDate(c.created_at)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedCase(c)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Détails
                        </button>
                        <div className="relative">
                          <select
                            value={c.status}
                            onChange={e => updateCaseStatus(c.id, e.target.value)}
                            disabled={isUpdating === c.id}
                            className="appearance-none bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium focus:outline-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="OPEN">Ouvert</option>
                            <option value="IN_PROGRESS">En cours</option>
                            <option value="RESOLVED">Résolu</option>
                            <option value="REJECTED">Rejeté</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Case Detail Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Détail du Dossier
              </h3>
              <button onClick={() => setSelectedCase(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { label: 'ID', value: selectedCase.id },
                { label: 'Type de document', value: DOC_TYPE_LABELS[selectedCase.document_type || ''] || DOC_TYPE_LABELS.default },
                { label: 'Titre', value: selectedCase.title || '—' },
                { label: 'Email plaignant', value: selectedCase.plaintiff?.email || '—' },
                { label: 'Plaignant', value: selectedCase.plaintiff_name || '—' },
                { label: 'Défendeur', value: selectedCase.defendant_name || '—' },
                { label: 'Montant', value: selectedCase.amount ? `${selectedCase.amount.toLocaleString('fr-DZ')} DZD` : '—' },
                { label: 'Description', value: selectedCase.description || '—' },
                { label: 'Créé le', value: formatDate(selectedCase.created_at) },
                { label: 'Modifié le', value: formatDate(selectedCase.updated_at) },
              ].map(({ label, value }) => (
                <div key={label} className="flex">
                  <span className="text-slate-500 text-sm w-36 flex-shrink-0">{label}</span>
                  <span className="text-slate-200 text-sm font-medium flex-1 break-all">{value}</span>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-800">
                <p className="text-slate-500 text-xs mb-2">Changer le statut</p>
                <div className="flex gap-2 flex-wrap">
                  {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'] as const).map(s => {
                    const cfg = STATUS_CONFIG[s]
                    return (
                      <button
                        key={s}
                        onClick={() => updateCaseStatus(selectedCase.id, s)}
                        disabled={selectedCase.status === s || isUpdating === selectedCase.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 ${
                          selectedCase.status === s
                            ? cfg.color + ' opacity-100'
                            : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
