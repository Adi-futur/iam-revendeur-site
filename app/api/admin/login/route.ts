import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }
  const res = Response.json({ ok: true })
  res.headers.set(
    'Set-Cookie',
    `admin_auth=${process.env.ADMIN_PASSWORD}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
  )
  return res
}
