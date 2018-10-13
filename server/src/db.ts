import * as pg from 'pg'
import * as secrets from '../../shared/secrets'
import {ok, err} from './utils'

const pool = new pg.Pool({
    database: 'usda28',
    user: 'kiwibit',
    password: secrets.db,
    host: 'localhost',
    port: 5432,
    max: 16
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client.', err, client)
    process.exit(-1)
})

export function selectOne<T extends {[key: string]: any} = any>(sql: string, params: any[]): Promise<T> {
    return pool.query(sql, params).then(res => {
        if (res.rows.length === 0) {
            return err(404, `Item not found.`)
        } else if (res.rows.length > 1) {
            return err(400, `More than one item found when only one was expected.`)
        }
        return ok(res.rows[0])
    })
}

export function selectMany<T extends {[key: string]: any} = any>(sql: string, params: any[] = []): Promise<T[]> {
    return pool.query(sql, params).then(res => res.rows)
}

export function insertOne<T extends {[key: string]: any}>(table: string, data: Partial<T>): Promise<T> {
    const columns: string[] = Object.keys(data)
    const placeholders: string[] = []
    const values: any[] = []
    columns.forEach((col, idx) => {
        placeholders.push('$' + (idx + 1))
        values.push(data[col])
    })
    return pool
        .query(`insert into ${table}(${columns.join(', ')}) values (${placeholders.join(', ')}) returning *`, values)
        .then(res => {
            if (res.rowCount !== 1) {
                return err(400, `Unexpected result inserting data in "${table}": ${res.rowCount} rows inserted.`)
            }
            return ok(res.rows[0])
        })
}

export function updateOne<T extends {[key: string]: any}>(table: string, data: Partial<T>, params: Partial<T>): Promise<T> {
    const assignments: string[] = []
    const conditions: string[] = []
    const values: any[] = []
    let idx = 1
    Object.keys(data).forEach(col => {
        assignments.push(col + ' = $' + idx)
        values.push(data[col])
        idx++
    })
    Object.keys(params).forEach(col => {
        conditions.push(col + ' = $' + idx)
        values.push(params[col])
        idx++
    })
    return pool
        .query(`update ${table} set ${assignments.join(', ')} where ${conditions.join(' and ')} returning *`, values)
        .then(res => {
            if (res.rowCount !== 1) {
                return err(400, `Unexpected result updating in "${table}": ${res.rowCount} rows updated.`)
            }
            return ok(res.rows[0])
        })
}

export function deleteOne<T extends {[key: string]: any}>(table: string, params: Partial<T>): Promise<T> {
    return remove(table, params).then(res => {
        if (res.rowCount !== 1) {
            return err(400, `Unexpected result deleting from "${table}": ${res.rowCount} rows deleted.`)
        }
        return ok(res.rows[0])
    })
}

export function deleteMany<T extends {[key: string]: any}>(table: string, params: Partial<T>): Promise<T[]> {
    return remove(table, params).then(res => {
        if (res.rowCount === 0) {
            return err(400, `No rows found to be deleted in "${table}".`)
        }
        return ok(res.rows)
    })
}

function remove(table: string, params: any): Promise<pg.QueryResult> {
    const conditions: string[] = []
    const values: any[] = []
    Object.keys(params).forEach((col, idx) => {
        conditions.push(col + ' = $' + (idx + 1))
        values.push(params[col])
    })
    return pool.query(`delete from ${table} where ${conditions.join(' and ')} returning *`, values)
}
