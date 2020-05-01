import { ClientConfig } from 'pg'

export const pgConfig: ClientConfig = {
  connectionString: process.env.DATABASE_URL
    || 'postgres://postgres:hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E@localhost:5000/postgres'
}
