'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { t, type Lang } from '@/lib/i18n'

function ConfirmationContent() {
  const params = useSearchParams()
  const lang = (params.get('lang') ?? 'fr') as Lang
  const T = t[lang]
  const isAr = lang === 'ar'

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${isAr ? 'font-arabic' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{T.confirm_title}</h1>
        <p className="text-gray-500 mb-8">{T.confirm_msg}</p>
        <a href={`/?lang=${lang}`}
          className="inline-block bg-[#E30613] text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
          {T.confirm_back}
        </a>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}
