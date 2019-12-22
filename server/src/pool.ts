import * as pg from 'pg'
import * as secrets from '../../secrets'
import * as config from '../../shared/config'
import {log} from './log'
import 'pgeon'

export const pool = new pg.Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.name,
    password: secrets.db,
    max: 16
})
.on('error', (err, client) => {
    log.error('Unexpected error on idle client.', err, client)
    process.exit(-1)
})
