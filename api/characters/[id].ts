import { prisma } from '../lib/prisma'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    const character = await prisma.character.findUnique({ where: { id: String(id) } })
    if (!character) return res.status(404).json({ error: 'Not found' })
    return res.json(character)
  }

  if (req.method === 'PATCH') {
    const { name, handle, role, affiliation, backstory, stats, derivedStats, roleAbility } = req.body
    const character = await prisma.character.update({
      where: { id: String(id) },
      data: { name, handle, role, affiliation, backstory, stats, derivedStats, roleAbility },
    })
    return res.json(character)
  }

  if (req.method === 'DELETE') {
    await prisma.character.delete({ where: { id: String(id) } })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
