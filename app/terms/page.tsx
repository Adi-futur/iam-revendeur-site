import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Netgear Distributeur Maroc Telecom",
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Présentation</h2>
            <p>
              Le présent site est exploité par <strong>Netgear</strong>, distributeur agréé de Maroc Telecom (IAM) au Maroc.
              Il permet aux clients de soumettre des demandes de souscription aux offres internet de Maroc Telecom
              (Fibre Optique, Box 4G+ et El Manzil 5G).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Nature du service</h2>
            <p>Ce site est un <strong>formulaire de prise de commande</strong>. La soumission d&apos;une demande ne constitue pas un contrat d&apos;abonnement ferme. Le dossier est traité par notre équipe puis transmis à Maroc Telecom pour validation et activation.</p>
            <p className="mt-2">Netgear agit en tant qu&apos;intermédiaire agréé entre le client et Maroc Telecom. Les offres, tarifs et conditions d&apos;abonnement sont ceux définis par Maroc Telecom et peuvent être consultés sur <a href="https://www.iam.ma" target="_blank" rel="noopener noreferrer" className="text-[#E30613] hover:underline">iam.ma</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Tarifs et offres</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-left">Offre</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Prix mensuel</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Fibre 100 Mb/s', '400 DH/mois', '12 mois'],
                    ['Fibre 200 Mb/s', '500 DH/mois', '12 mois'],
                    ['Fibre 1 Gb/s', '1 000 DH/mois', '12 mois'],
                    ['Box 4G+ (40 Go)', 'MES 200 DH + Routeur 150 DH', '3 mois'],
                    ['El Manzil 5G', '400 DH/mois + Routeur 350 DH', '12 mois'],
                  ].map(([offre, prix, engagement]) => (
                    <tr key={offre} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-medium">{offre}</td>
                      <td className="border border-gray-200 px-4 py-2">{prix}</td>
                      <td className="border border-gray-200 px-4 py-2">{engagement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-500">* L&apos;installation de la Fibre Optique est GRATUITE via notre distributeur (économie de 200 DH par rapport à IAM direct).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Obligations du client</h2>
            <p>En soumettant une demande, le client s&apos;engage à :</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-600">
              <li>Fournir des informations exactes et à jour</li>
              <li>Transmettre des copies lisibles et authentiques de sa CIN</li>
              <li>Être joignable au numéro de téléphone indiqué pour la coordination de l&apos;installation</li>
              <li>Ne pas utiliser ce formulaire à des fins frauduleuses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Délais de traitement</h2>
            <p>
              Une fois le dossier complet reçu, notre équipe vous contacte sous <strong>24 heures</strong>.
              Le délai d&apos;installation varie de <strong>48 heures à 7 jours ouvrables</strong> selon votre zone géographique
              et la disponibilité des techniciens Maroc Telecom.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Éligibilité géographique</h2>
            <p>Les offres sont disponibles dans les villes et zones couvertes par Maroc Telecom :</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-gray-600">
              <li><strong>Fibre Optique</strong> : Casablanca, Rabat, Salé, Témara, Marrakech, Fès, Tanger, Agadir et banlieues</li>
              <li><strong>El Manzil 5G</strong> : Grandes villes (vérification de couverture requise)</li>
              <li><strong>Box 4G+</strong> : Disponible partout au Maroc</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation de responsabilité</h2>
            <p>
              Netgear agit en qualité de distributeur agréé et ne saurait être tenu responsable des décisions
              de Maroc Telecom concernant l&apos;activation, la modification ou la résiliation des abonnements.
              Les pannes, interruptions de service et questions techniques relèvent de la responsabilité de Maroc Telecom.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Droit applicable</h2>
            <p>
              Les présentes CGU sont régies par le droit marocain.
              Tout litige sera soumis à la compétence des tribunaux compétents du Royaume du Maroc.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>
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
