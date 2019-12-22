import { Pool } from 'pg'
import { pgConfig } from './pgConfig'
import { log } from './log'

import 'pgeon'

export const pool = new Pool({ ...pgConfig, max: 16 }).on('error', (err, client) => {
    log.error('Unexpected error on idle client.', err, client)
    process.exit(-1)
})
