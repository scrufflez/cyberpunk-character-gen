import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json')

  try {
    const { id } = req.query

    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM "Character" WHERE id = $1', [id])
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(rows[0])
    }

    if (req.method === 'PATCH') {
      const { name, handle, role, affiliation, backstory, stats, derivedStats, roleAbility } = req.body
      const { rows } = await pool.query(
        `UPDATE "Character"
         SET name = $1, handle = $2, role = $3, affiliation = $4, backstory = $5,
             stats = $6, "derivedStats" = $7, "roleAbility" = $8, "updatedAt" = NOW()
         WHERE id = $9
         RETURNING *`,
        [name, handle, role, affiliation, backstory,
          JSON.stringify(stats), JSON.stringify(derivedStats), JSON.stringify(roleAbility), id]
      )
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(rows[0])
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM "Character" WHERE id = $1', [id])
      return res.status(200).json({ success: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('API error:', e)
    res.status(500).json({ error: e.message || 'Internal error' })
  }
}
