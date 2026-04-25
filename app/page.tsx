'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'

// ── Fibre sub-offers ──────────────────────────────────────────────────────────
const FIBRE_SPEEDS = [
  {
    speed: '100 Mb/s',
    price: '400',
    labelFr: 'Fibre 100 Mb/s',
    labelAr: 'ألياف 100 ميغابت',
    descKey: 'fibre_ideal' as const,
    popular: false,
  },
  {
    speed: '200 Mb/s',
    price: '500',
    labelFr: 'Fibre 200 Mb/s',
    labelAr: 'ألياف 200 ميغابت',
    descKey: 'fibre_streaming' as const,
    popular: true,
  },
  {
    speed: '1 Gb/s',
    price: '1 000',
    labelFr: 'Fibre 1 Gb/s',
    labelAr: 'ألياف 1 جيغابت',
    descKey: 'fibre_ultra' as const,
    popular: false,
  },
]

// ── Photo input with preview ──────────────────────────────────────────────────
function PhotoInput({ label, hint, name, onChange }: {
  label: string; hint: string; name: string; onChange: (f: File | null) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#E30613] transition-colors text-center bg-gray-50">
        {preview ? (
          <img src={preview} alt="preview" className="h-24 object-contain mx-auto rounded-lg" />
        ) : (
          <div className="text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400">{hint}</span>
          </div>
        )}
        <input ref={ref} type="file" name={name} accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const isAr = lang === 'ar'
  const T = t[lang]

  // Modal state
  const [modal, setModal] = useState<'none' | 'fibre-choose' | 'form'>('none')
  const [selectedOffer, setSelectedOffer] = useState('')
  const [cinRecto, setCinRecto] = useState<File | null>(null)
  const [cinVerso, setCinVerso] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openOffer(key: string) {
    if (key === 'fibre') {
      setModal('fibre-choose')
    } else if (key === 'box4g') {
      setSelectedOffer(isAr ? 'بوكس 4G+' : 'Box 4G+')
      setModal('form')
    } else if (key === 'manzil5g') {
      setSelectedOffer(isAr ? 'المنزل 5G' : 'El Manzil 5G')
      setModal('form')
    }
  }

  function selectFibre(speed: typeof FIBRE_SPEEDS[0]) {
    setSelectedOffer(isAr ? speed.labelAr : speed.labelFr)
    setModal('form')
  }

  function closeModal() {
    setModal('none')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('offre', selectedOffer)
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
    <div className={`min-h-screen bg-white ${isAr ? 'font-arabic' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Netgear</span>
              <span className="text-[10px] font-semibold text-[#E30613] uppercase tracking-widest">
                Distributeur Agréé Maroc Telecom
              </span>
            </div>
          </div>
          {/* IAM logo area + lang toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#E30613]" />
              <span className="text-xs font-semibold text-[#E30613]">Maroc Telecom</span>
            </div>
            <button onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
              <span>{lang === 'fr' ? '🇲🇦' : '🇫🇷'}</span>
              <span className="hidden sm:inline">{lang === 'fr' ? 'عربي' : 'Français'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#E30613] to-[#8B0000] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-5 py-2 text-sm font-semibold mb-8 border border-white/20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {T.free_install}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight whitespace-pre-line">
            {T.hero_title}
          </h1>
          <p className="text-lg text-red-100 max-w-xl mx-auto">{T.hero_sub}</p>
        </div>
      </section>

      {/* ── Offers ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          {T.offers_title}
        </h2>
        <p className="text-center text-gray-400 text-sm mb-10">Netgear — {T.nav_tagline}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Fibre Optique */}
          <div className="offer-card bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-[#E30613] hover:shadow-xl cursor-pointer overflow-hidden"
            onClick={() => openOffer('fibre')}>
            <div className="bg-[#E30613] p-6 text-white">
              <div className="text-4xl mb-3">📡</div>
              <h3 className="text-xl font-bold">{isAr ? 'الألياف الضوئية' : 'Fibre Optique'}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{isAr ? 'من 400' : 'dès 400'}</span>
                <span className="text-sm opacity-80">{T.per_month}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🎁 {isAr ? 'التركيب مجاني — توفير 200 درهم' : 'Installation GRATUITE — économie 200 DH'}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.speed}</span>
                  <span className="font-semibold text-gray-800">100 Mb/s — 1 Gb/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.commitment}</span>
                  <span className="font-semibold text-gray-800">12 {isAr ? 'شهراً' : 'mois min'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.included}</span>
                  <span className="font-semibold text-gray-800 text-right text-xs">{isAr ? 'مكالمات ثابتة + 10h موبايل' : 'Appels fixes + 10h mobile'}</span>
                </div>
              </div>
              <button className="w-full mt-5 bg-[#E30613] text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors text-sm">
                {T.subscribe}
              </button>
            </div>
          </div>

          {/* Box 4G+ */}
          <div className="offer-card bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-[#E30613] hover:shadow-xl cursor-pointer overflow-hidden"
            onClick={() => openOffer('box4g')}>
            <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 text-white">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-xl font-bold">{isAr ? 'بوكس 4G+' : 'Box 4G+'}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">40 Go</span>
                <span className="text-sm opacity-80">· 225 Mb/s</span>
              </div>
            </div>
            <div className="p-5">
              <div className="inline-block bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                ⭐ {isAr ? 'عرض حصري' : 'Offre unique'}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.activation}</span>
                  <span className="font-semibold text-gray-800">200 DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.router}</span>
                  <span className="font-semibold text-gray-800">150 DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.commitment}</span>
                  <span className="font-semibold text-gray-800">3 {isAr ? 'أشهر' : 'mois min'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.data}</span>
                  <span className="font-semibold text-gray-800 text-xs">{isAr ? 'يُنقل الرصيد غير المستهلك' : 'Report mensuel inclus'}</span>
                </div>
              </div>
              <button className="w-full mt-5 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors text-sm">
                {T.subscribe}
              </button>
            </div>
          </div>

          {/* El Manzil 5G */}
          <div className="offer-card bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-[#E30613] hover:shadow-xl cursor-pointer overflow-hidden"
            onClick={() => openOffer('manzil5g')}>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-bold">{isAr ? 'المنزل 5G' : 'El Manzil 5G'}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">400</span>
                <span className="text-sm opacity-80">{T.per_month}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🎁 {isAr ? 'راوتر 350 درهم بدل 1080' : 'Routeur 350 DH au lieu de 1080 DH'}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.speed}</span>
                  <span className="font-semibold text-gray-800">100 Mb/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.data}</span>
                  <span className="font-semibold text-gray-800">200 Go/mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.router}</span>
                  <span className="font-semibold text-gray-800">350 DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{T.commitment}</span>
                  <span className="font-semibold text-gray-800">12 {isAr ? 'شهراً' : 'mois min'}</span>
                </div>
              </div>
              <button className="w-full mt-5 bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition-colors text-sm">
                {T.subscribe}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white font-bold text-lg mb-1">Netgear</div>
          <div className="text-[#E30613] text-sm font-semibold mb-4">{T.nav_tagline}</div>
          <div className="flex items-center justify-center gap-4 mb-4 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {isAr ? 'سياسة الخصوصية' : 'Politique de confidentialité'}
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              {isAr ? 'الشروط والأحكام' : "Conditions d'utilisation"}
            </Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Netgear — Distributeur Agréé Maroc Telecom. Tous droits réservés.</p>
        </div>
      </footer>

      {/* ── MODAL: Fibre speed selection ──────────────────────────────── */}
      {modal === 'fibre-choose' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#E30613] p-5 flex items-center justify-between">
              <div className="text-white">
                <div className="text-2xl mb-1">📡</div>
                <h2 className="text-lg font-bold">{T.fibre_choose}</h2>
              </div>
              <button onClick={closeModal} className="text-white/70 hover:text-white p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Sub-offers */}
            <div className="p-6 space-y-3">
              {FIBRE_SPEEDS.map((s) => (
                <div key={s.speed}
                  onClick={() => selectFibre(s)}
                  className={`fibre-sub-card relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer
                    ${s.popular ? 'border-[#E30613] bg-red-50' : 'border-gray-200 hover:border-[#E30613] bg-white'}`}>
                  {s.popular && (
                    <span className="absolute -top-2.5 left-4 bg-[#E30613] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐ {isAr ? 'الأكثر طلباً' : 'Le plus demandé'}
                    </span>
                  )}
                  <div>
                    <div className="font-bold text-gray-900">{isAr ? s.labelAr : s.labelFr}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{T[s.descKey]}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-2xl font-extrabold text-[#E30613]">{s.price}</div>
                    <div className="text-xs text-gray-400">{T.per_month}</div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-center pt-2">
                ✅ {T.fibre_common}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Order form ──────────────────────────────────────────── */}
      {modal === 'form' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#E30613] p-5 flex items-center justify-between sticky top-0">
              <div className="text-white">
                <h2 className="text-lg font-bold">{T.form_title}</h2>
                <p className="text-sm opacity-80">{selectedOffer}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedOffer.toLowerCase().includes('fibre') || selectedOffer.includes('ألياف') ? (
                  <button onClick={() => setModal('fibre-choose')}
                    className="text-white/70 hover:text-white text-xs px-2 py-1 border border-white/30 rounded-lg">
                    {T.back}
                  </button>
                ) : null}
                <button onClick={closeModal} className="text-white/70 hover:text-white p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ name: 'nom', label: T.nom }, { name: 'prenom', label: T.prenom }].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type="text" name={f.name} required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E30613] bg-gray-50" />
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E30613] bg-gray-50" />
                </div>
              ))}
              <PhotoInput label={T.cin_recto} hint={T.cin_hint} name="cin_recto" onChange={setCinRecto} />
              <PhotoInput label={T.cin_verso} hint={T.cin_hint} name="cin_verso" onChange={setCinVerso} />
              {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={submitting}
                className="w-full bg-[#E30613] text-white py-3.5 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {submitting ? T.submitting : T.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
