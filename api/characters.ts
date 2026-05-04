import { sql } from '@vercel/postgres'

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT id, name, role, handle, "createdAt"
        FROM "Character"
        ORDER BY "createdAt" DESC
      `
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { name, handle, role, affiliation, backstory, avatarSeed, stats, derivedStats, roleAbility } = req.body
      const { rows } = await sql`
        INSERT INTO "Character" (name, handle, role, affiliation, backstory, "avatarSeed", stats, "derivedStats", "roleAbility")
        VALUES (
          ${name}, ${handle}, ${role}, ${affiliation}, ${backstory}, ${avatarSeed},
          ${JSON.stringify(stats)}, ${JSON.stringify(derivedStats)}, ${JSON.stringify(roleAbility)}
        )
        RETURNING *
      `
      return res.status(200).json(rows[0])
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('API error:', e)
    res.status(500).json({ error: e.message || 'Internal error' })
  }
}
