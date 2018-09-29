import * as pg from 'pg'
import * as secrets from '../../shared/secrets'

const pool = new pg.Pool({
    database: 'usda28',
    user: 'kiwibit',
    password: secrets.db,
    host: 'localhost',
    port: 5432,
    max: 16
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err, client)
    process.exit(-1)
})

export function selectOne<T extends {[key: string]: any} = any>(sql: string, params: any[] = []): Promise<T> {
    return pool.query(sql, params).then(res => {
        if (res.rows.length === 0) {
            throw new Error(`Item not found.`)
        } else if (res.rows.length > 1) {
            throw new Error(`More than one item found when only one was expected.`)
        }
        return res.rows[0]
    })
}

export function selectMany<T extends {[key: string]: any} = any>(sql: string, params: any[] = []): Promise<T[]> {
    return pool.query(sql, params).then(res => res.rows)
}

export function insertOne<T extends {[key: string]: any}>(table: string, data: Partial<T>): Promise<T> {
    const columns: string[] = Object.keys(data)
    const placeholders: string[] = []
    const values: any[] = []
    for (let i = 0; i < columns.length; ++i) {
        placeholders.push('$' + (i + 1))
        values.push(data[columns[i]])
    }
    return pool
        .query(`insert into ${table}(${columns.join(', ')}) set (${placeholders.join(', ')}) returning *`, values)
        .then(res => {
            if (res.rowCount !== 1) {
                throw new Error(`Unexpected result inserting data in "${table}": ${res.rowCount} rows inserted.`)
            }
            return res.rows[0]
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
                throw new Error(`Unexpected result updating in "${table}": ${res.rowCount} rows updated.`)
            }
            return res.rows[0]
        })
}

export function deleteOne<T extends {[key: string]: any}>(table: string, params: Partial<T>): Promise<T> {
    const conditions: string[] = []
    const values: any[] = []
    Object.keys(params).forEach((col, idx) => {
        conditions.push(col + ' = $' + (idx + 1))
        values.push(params[col])
    })
    return pool
        .query(`delete from ${table} where ${conditions.join(' and ')} returning *`, values)
        .then(res => {
            if (res.rowCount !== 1) {
                throw new Error(`Unexpected result deleting from "${table}": ${res.rowCount} rows deleted.`)
            }
            return res.rows[0]
        })
}
