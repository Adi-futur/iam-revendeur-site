import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Internet Maroc Telecom — Distributeur Agréé',
  description: 'Souscrivez à la Fibre Optique, Box 4G+ ou El Manzil 5G. Installation gratuite. Distributeur agréé Maroc Telecom.',
  keywords: 'Maroc Telecom, fibre optique, internet Maroc, Box 4G, 5G Maroc',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
