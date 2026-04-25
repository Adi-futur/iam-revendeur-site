import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function requireAuth(request: NextRequest) {
  const auth = request.cookies.get('admin_auth')?.value
  return auth === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) return new Response('Unauthorized', { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PATCH(request: NextRequest) {
  if (!requireAuth(request)) return new Response('Unauthorized', { status: 401 })
  const { id, statut } = await request.json()
  const supabase = createServiceClient()
  const { error } = await supabase.from('orders').update({ statut }).eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
