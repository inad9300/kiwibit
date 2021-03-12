import { newConnectionPool } from './pgeon'

export const pool = newConnectionPool({
  host: 'localhost',
  port: 5000,
  database: 'postgres',
  username: 'postgres',
  password: 'hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E'
})
