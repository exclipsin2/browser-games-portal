import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import games from '@/lib/games'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getSession({ req })
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: 'forbidden' })
  }

  if (req.method === 'GET'){
    return res.status(200).json(games)
  }

  if (req.method === 'POST'){
    // accept minimal update payload
    const body = req.body
    // Validate inputs in production
    const idx = games.findIndex(g => g.slug === body.slug)
    if (idx === -1) return res.status(404).json({ error: 'not found' })
    games[idx] = { ...games[idx], ...body }
    return res.status(200).json(games[idx])
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end()
}
