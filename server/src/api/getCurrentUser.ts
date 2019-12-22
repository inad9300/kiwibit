import { pool } from '../pool'
import * as schema from '../schema'

type WithToken = {
  token: string
}

export async function getCurrentUser(_input: WithToken) {
  let uno = 1
  let dos = 2
  const res = await pool.$query<schema.users>`
        select *
        from users
        where id = ${uno + dos}
    `
  return res.rows[0]
}
