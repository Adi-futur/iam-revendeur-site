import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export const runtime = 'nodejs'

async function uploadCin(
  file: File,
  phone: string,
  label: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string | null> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${phone}/${label}_${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('cin-photos')
    .upload(filename, buffer, { contentType: file.type, upsert: false })
  if (error) { console.error('[Storage]', label, error.message); return null }
  return supabase.storage.from('cin-photos').getPublicUrl(filename).data.publicUrl
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const nom = String(formData.get('nom') ?? '').trim()
    const prenom = String(formData.get('prenom') ?? '').trim()
    const telephone = String(formData.get('telephone') ?? '').trim()
    const adresse = String(formData.get('adresse') ?? '').trim()
    const offre = String(formData.get('offre') ?? '').trim()
    const cinRecto = formData.get('cin_recto') as File | null
    const cinVerso = formData.get('cin_verso') as File | null

    if (!nom || !prenom || !telephone || !adresse || !offre) {
      return Response.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Upload CIN photos
    const cinRectoUrl = cinRecto ? await uploadCin(cinRecto, telephone, 'recto', supabase) : null
    const cinVersoUrl = cinVerso ? await uploadCin(cinVerso, telephone, 'verso', supabase) : null

    // Save order to Supabase
    const { error: insertError } = await supabase.from('orders').insert({
      phone_number: telephone,
      nom,
      prenom,
      adresse,
      offre,
      cin_recto_url: cinRectoUrl,
      cin_verso_url: cinVersoUrl,
      statut: 'en_attente',
      source: 'web',
    })

    if (insertError) {
      console.error('[Supabase] Insert failed:', insertError.message)
    }

    // WhatsApp notification to manager
    const notifyTo = process.env.WHATSAPP_NOTIFY_NUMBER
    if (notifyTo) {
      const now = new Date().toLocaleString('fr-MA', { timeZone: 'Africa/Casablanca' })
      await sendWhatsAppMessage(
        notifyTo,
        `🌐 Nouvelle commande WEB !\n👤 ${prenom} ${nom}\n📱 +${telephone}\n📍 ${adresse}\n📦 ${offre}\n⏰ ${now}`
      ).catch((err) => console.error('[Notify]', err))
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[API/order]', err)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
