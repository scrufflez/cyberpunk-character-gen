import { sql } from '@vercel/postgres'

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')

  try {
    const { id } = req.query

    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM "Character" WHERE id = ${id}`
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(rows[0])
    }

    if (req.method === 'PATCH') {
      const { name, handle, role, affiliation, backstory, stats, derivedStats, roleAbility } = req.body
      const { rows } = await sql`
        UPDATE "Character"
        SET
          name = ${name},
          handle = ${handle},
          role = ${role},
          affiliation = ${affiliation},
          backstory = ${backstory},
          stats = ${JSON.stringify(stats)},
          "derivedStats" = ${JSON.stringify(derivedStats)},
          "roleAbility" = ${JSON.stringify(roleAbility)},
          "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING *
      `
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(rows[0])
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM "Character" WHERE id = ${id}`
      return res.status(200).json({ success: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('API error:', e)
    res.status(500).json({ error: e.message || 'Internal error' })
  }
}
