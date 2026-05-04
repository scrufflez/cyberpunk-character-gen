import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, role: true, handle: true, createdAt: true },
    })
    return res.json(characters)
  }

  if (req.method === 'POST') {
    const { name, handle, role, affiliation, backstory, avatarSeed, stats, derivedStats, roleAbility } = req.body
    const character = await prisma.character.create({
      data: { name, handle, role, affiliation, backstory, avatarSeed, stats, derivedStats, roleAbility },
    })
    return res.json(character)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
