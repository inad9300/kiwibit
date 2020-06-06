import { Pool } from 'pg'
import { log } from './log'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E@localhost:5000/postgres',
  max: 16
})
.on('error', (err, client) => {
  log.error('Unexpected error on idle client.', err, client)
})
