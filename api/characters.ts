import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.method === 'GET') {
      const characters = await prisma.character.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, role: true, handle: true, createdAt: true },
      })
      return res.status(200).json(characters)
    }

    if (req.method === 'POST') {
      const { name, handle, role, affiliation, backstory, avatarSeed, stats, derivedStats, roleAbility } = req.body
      const character = await prisma.character.create({
        data: { name, handle, role, affiliation, backstory, avatarSeed, stats, derivedStats, roleAbility },
      })
      return res.status(200).json(character)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('API error:', e)
    res.status(500).json({ error: e.message || 'Internal error' })
  }
}
