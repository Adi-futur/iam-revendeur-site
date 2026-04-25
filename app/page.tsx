'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { t, type Lang } from '@/lib/i18n'

type Offre = 'fibre' | 'box4g' | 'manzil5g'

interface OfferConfig {
  key: Offre
  icon: string
  color: string
  nameFr: string
  nameAr: string
  price: string
  priceSuffix: string
  specs: { labelKey: keyof typeof t.fr; value: string }[]
  badge?: string
}

const OFFERS: OfferConfig[] = [
  {
    key: 'fibre',
    icon: '📡',
    color: 'from-blue-600 to-blue-800',
    nameFr: 'Fibre Optique',
    nameAr: 'الألياف الضوئية',
    price: 'dès 400',
    priceSuffix: 'DH/mois',
    badge: 'Installation GRATUITE',
    specs: [
      { labelKey: 'speed', value: '100 Mb/s — 1 Gb/s' },
      { labelKey: 'commitment', value: '12 مois min' },
      { labelKey: 'included', value: 'Appels fixes illimités + 10h mobile' },
      { labelKey: 'economy', value: '200 DH vs IAM direct' },
    ],
  },
  {
    key: 'box4g',
    icon: '📦',
    color: 'from-orange-500 to-orange-700',
    nameFr: 'Box 4G+',
    nameAr: 'بوكس 4G+',
    price: '40 Go',
    priceSuffix: '· 225 Mb/s',
    specs: [
      { labelKey: 'activation', value: '200 DH' },
      { labelKey: 'router', value: '150 DH' },
      { labelKey: 'commitment', value: '3 mois min' },
      { labelKey: 'data', value: 'Report mensuel inclus' },
    ],
  },
  {
    key: 'manzil5g',
    icon: '🚀',
    color: 'from-purple-600 to-purple-800',
    nameFr: 'El Manzil 5G',
    nameAr: 'المنزل 5G',
    price: '400',
    priceSuffix: 'DH/mois',
    badge: 'Routeur 350 DH au lieu de 1080 DH',
    specs: [
      { labelKey: 'speed', value: '100 Mb/s' },
      { labelKey: 'data', value: '200 Go/mois' },
      { labelKey: 'router', value: '350 DH (au lieu de 1080 DH)' },
      { labelKey: 'commitment', value: '12 mois min' },
    ],
  },
]

function PhotoInput({
  label, hint, name, onChange
}: { label: string; hint: string; name: string; onChange: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-[#E30613] transition-colors text-center"
      >
        {preview ? (
          <img src={preview} alt="preview" className="h-24 object-contain mx-auto rounded" />
        ) : (
          <div className="text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">{hint}</span>
          </div>
        )}
        <input ref={ref} type="file" name={name} accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const [activeOffer, setActiveOffer] = useState<OfferConfig | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cinRecto, setCinRecto] = useState<File | null>(null)
  const [cinVerso, setCinVerso] = useState<File | null>(null)
  const T = t[lang]
  const isAr = lang === 'ar'

  const getOfferName = useCallback((o: OfferConfig) => isAr ? o.nameAr : o.nameFr, [isAr])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeOffer) return
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    data.set('offre', getOfferName(activeOffer))
    if (cinRecto) data.set('cin_recto', cinRecto)
    if (cinVerso) data.set('cin_verso', cinVerso)

    try {
      const res = await fetch('/api/order', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur')
      router.push(`/confirmation?lang=${lang}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isAr ? 'font-arabic' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E30613] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IAM</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">Maroc Telecom</div>
              <div className="text-xs text-gray-500">{T.nav_tagline}</div>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <span>{lang === 'fr' ? '🇲🇦' : '🇫🇷'}</span>
            <span>{lang === 'fr' ? 'عربي' : 'Français'}</span>
          </button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#E30613] to-red-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span>✨</span>
            <span>{T.free_install}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight whitespace-pre-line">
            {T.hero_title}
          </h1>
          <p className="text-lg text-red-100">{T.hero_sub}</p>
        </div>
      </section>

      {/* ── Offers ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          {T.offers_title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <div key={offer.key}
              className="offer-card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl cursor-pointer border-2 border-transparent hover:border-[#E30613]"
              onClick={() => setActiveOffer(offer)}
            >
              {/* Card header */}
              <div className={`bg-gradient-to-br ${offer.color} p-6 text-white`}>
                <div className="text-4xl mb-3">{offer.icon}</div>
                <h3 className="text-xl font-bold">{getOfferName(offer)}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{offer.price}</span>
                  <span className="text-sm opacity-80">{offer.priceSuffix}</span>
                </div>
              </div>
              {/* Specs */}
              <div className="p-5 space-y-3">
                {offer.badge && (
                  <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    🎁 {offer.badge}
                  </div>
                )}
                {offer.specs.map((s, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500">{T[s.labelKey]}</span>
                    <span className="font-medium text-gray-800 text-right max-w-[55%]">{s.value}</span>
                  </div>
                ))}
                <button
                  className="w-full mt-4 bg-[#E30613] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setActiveOffer(offer) }}
                >
                  {T.subscribe}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p className="font-semibold text-white mb-1">Distributeur Agréé Maroc Telecom</p>
        <p>© {new Date().getFullYear()} — Tous droits réservés</p>
      </footer>

      {/* ── Order Modal ─────────────────────────────────────────────────── */}
      {activeOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveOffer(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className={`bg-gradient-to-br ${activeOffer.color} p-5 flex items-center justify-between`}>
              <div className="text-white">
                <div className="text-2xl mb-1">{activeOffer.icon}</div>
                <h2 className="text-lg font-bold">{T.form_title}</h2>
                <p className="text-sm opacity-80">{getOfferName(activeOffer)}</p>
              </div>
              <button onClick={() => setActiveOffer(null)}
                className="text-white/70 hover:text-white p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'nom', label: T.nom },
                  { name: 'prenom', label: T.prenom },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type="text" name={f.name} required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E30613]" />
                  </div>
                ))}
              </div>

              {[
                { name: 'telephone', label: T.telephone, type: 'tel', placeholder: '06XXXXXXXX' },
                { name: 'adresse', label: T.adresse, type: 'text', placeholder: '' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} name={f.name} required placeholder={f.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E30613]" />
                </div>
              ))}

              <PhotoInput label={T.cin_recto} hint={T.cin_hint} name="cin_recto" onChange={setCinRecto} />
              <PhotoInput label={T.cin_verso} hint={T.cin_hint} name="cin_verso" onChange={setCinVerso} />

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={submitting}
                className="w-full bg-[#E30613] text-white py-3.5 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-colors text-sm">
                {submitting ? T.submitting : T.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
