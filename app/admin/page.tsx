'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  nom: string | null
  prenom: string | null
  phone_number: string
  adresse: string | null
  offre: string | null
  statut: string
  source: string | null
  cin_recto_url: string | null
  cin_verso_url: string | null
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ statut }: { statut: string }) {
  const styles: Record<string, string> = {
    en_attente: 'bg-yellow-100 text-yellow-700',
    traite: 'bg-green-100 text-green-700',
    annule: 'bg-red-100 text-red-600',
  }
  const labels: Record<string, string> = {
    en_attente: '⏳ En attente',
    traite: '✅ Traité',
    annule: '❌ Annulé',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[statut] ?? 'bg-gray-100 text-gray-600'}`}>
      {labels[statut] ?? statut}
    </span>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'en_attente' | 'traite'>('all')
  const [photoModal, setPhotoModal] = useState<{ url: string; label: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then(setOrders)
      .catch((e) => { if (e === 401) router.push('/admin/login') })
      .finally(() => setLoading(false))
  }, [router])

  async function updateStatut(id: string, statut: string) {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut }),
    })
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statut } : o))
  }

  async function handleLogout() {
    document.cookie = 'admin_auth=; Path=/; Max-Age=0'
    router.push('/admin/login')
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.statut === filter)
  const stats = {
    total: orders.length,
    en_attente: orders.filter((o) => o.statut === 'en_attente').length,
    traite: orders.filter((o) => o.statut === 'traite').length,
    web: orders.filter((o) => o.source === 'web').length,
    whatsapp: orders.filter((o) => o.source !== 'web').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E30613] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">IAM</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">Admin — Gestion des commandes</h1>
            <p className="text-xs text-gray-400">{orders.length} commandes au total</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-800">← Site</a>
          <button onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-800 text-white' },
            { label: 'En attente', value: stats.en_attente, color: 'bg-yellow-500 text-white' },
            { label: 'Traités', value: stats.traite, color: 'bg-green-500 text-white' },
            { label: 'Via Web', value: stats.web, color: 'bg-blue-500 text-white' },
            { label: 'Via WhatsApp', value: stats.whatsapp, color: 'bg-purple-500 text-white' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-80 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(['all', 'en_attente', 'traite'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${filter === f ? 'bg-[#E30613] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {f === 'all' ? 'Toutes' : f === 'en_attente' ? 'En attente' : 'Traitées'}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-20">Aucune commande</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Nom', 'Téléphone', 'Offre', 'Adresse', 'Source', 'Date', 'Photos CIN', 'Statut', 'Action'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {o.prenom} {o.nom}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">+{o.phone_number}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-red-50 text-[#E30613] text-xs font-semibold rounded-full">
                          {o.offre ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{o.adresse ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${o.source === 'web' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          {o.source === 'web' ? '🌐 Web' : '💬 WhatsApp'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(o.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {o.cin_recto_url ? (
                            <button onClick={() => setPhotoModal({ url: o.cin_recto_url!, label: 'CIN Recto' })}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:border-[#E30613] transition-colors flex-shrink-0">
                              <img src={o.cin_recto_url} alt="recto" className="w-full h-full object-cover" />
                            </button>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                          {o.cin_verso_url ? (
                            <button onClick={() => setPhotoModal({ url: o.cin_verso_url!, label: 'CIN Verso' })}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:border-[#E30613] transition-colors flex-shrink-0">
                              <img src={o.cin_verso_url} alt="verso" className="w-full h-full object-cover" />
                            </button>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge statut={o.statut} /></td>
                      <td className="px-4 py-3">
                        {o.statut === 'en_attente' && (
                          <div className="flex gap-1">
                            <button onClick={() => updateStatut(o.id, 'traite')}
                              className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap">
                              ✅ Traiter
                            </button>
                            <button onClick={() => updateStatut(o.id, 'annule')}
                              className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200 transition-colors">
                              ✕
                            </button>
                          </div>
                        )}
                        {o.statut === 'traite' && (
                          <button onClick={() => updateStatut(o.id, 'en_attente')}
                            className="text-xs text-gray-400 hover:text-gray-600">
                            Réouvrir
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {photoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPhotoModal(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">{photoModal.label}</h3>
              <button onClick={() => setPhotoModal(null)} className="text-gray-400 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img src={photoModal.url} alt={photoModal.label} className="w-full object-contain max-h-[70vh]" />
            <div className="px-5 py-3 border-t border-gray-100">
              <a href={photoModal.url} target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#E30613] hover:underline font-medium">
                Ouvrir en plein écran →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
