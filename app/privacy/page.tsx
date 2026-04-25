import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Netgear Distributeur Maroc Telecom',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-gray-900">Netgear</span>
            <span className="text-[10px] font-semibold text-[#E30613] uppercase tracking-widest">
              Distributeur Agréé Maroc Telecom
            </span>
          </div>
          <Link href="/" className="text-sm text-[#E30613] hover:underline font-medium">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Collecte des données personnelles</h2>
            <p>Dans le cadre du traitement de vos demandes de souscription aux offres Maroc Telecom, nous collectons les informations suivantes :</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-600">
              <li>Nom et prénom</li>
              <li>Numéro de téléphone</li>
              <li>Adresse complète de livraison</li>
              <li>Copies de la Carte d&apos;Identité Nationale (CIN) recto et verso</li>
              <li>L&apos;offre internet choisie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Utilisation des données</h2>
            <p>Vos données personnelles sont utilisées exclusivement pour :</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-600">
              <li>Traiter votre demande de souscription à une offre Maroc Telecom</li>
              <li>Vous contacter pour finaliser votre dossier</li>
              <li>Organiser l&apos;installation ou la livraison de votre équipement</li>
              <li>Transmettre votre dossier à Maroc Telecom (IAM) pour activation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Stockage et sécurité</h2>
            <p>
              Vos données, y compris les photos de CIN, sont stockées de manière sécurisée sur des serveurs protégés (Supabase — infrastructure cloud certifiée).
              L&apos;accès à vos données est strictement limité au personnel autorisé de Netgear dans le cadre du traitement de votre dossier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Partage des données</h2>
            <p>
              Vos données ne sont partagées qu&apos;avec <strong>Maroc Telecom (IAM)</strong> dans le but exclusif d&apos;activer votre abonnement.
              Elles ne sont jamais vendues, louées ou transmises à des tiers à des fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Conservation des données</h2>
            <p>
              Vos données personnelles sont conservées pendant la durée nécessaire au traitement de votre dossier,
              puis archivées conformément aux obligations légales marocaines (Loi 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Vos droits</h2>
            <p>Conformément à la Loi 09-08, vous disposez des droits suivants :</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-600">
              <li><strong>Droit d&apos;accès</strong> : consulter vos données personnelles</li>
              <li><strong>Droit de rectification</strong> : corriger des informations inexactes</li>
              <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits, contactez-nous par WhatsApp au <strong>+212 661 961 717</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact</h2>
            <p>
              Pour toute question relative à cette politique de confidentialité :<br />
              <strong>Netgear — Distributeur Agréé Maroc Telecom</strong><br />
              WhatsApp : +212 661 961 717
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-center text-xs mt-12">
        <p>© {new Date().getFullYear()} Netgear — Distributeur Agréé Maroc Telecom</p>
      </footer>
    </div>
  )
}
