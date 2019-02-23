import 'reflect-metadata'
import {Ctor} from '../../shared/Types'
import {PgTypeId} from './PgTypeId'
import * as assert from 'assert'
import * as pg from 'pg'
import * as Q from './Q'
import * as secrets from '../../shared/secrets'

type ColCtor = BooleanConstructor | NumberConstructor | StringConstructor | DateConstructor

const VALID_COL_CTORS: ColCtor[] = [Boolean, Number, String, Date]

const EXPECTED_RESULT_TYPES: {
    [resultCtorName: string]: {
        [colName: string]: ColCtor
    }
} = {}

import * as dbs from '../../shared/db/schema'

registerTables(
    dbs.data_src,
    dbs.src_cd,
    // ...
)

function registerTables(...tables: any[]) {
    // ...
}

// export function Field(prototype: Object, column: string) {
//     if (global.$debug) {
//         const resultCtorName = prototype.constructor.name
//         if (!EXPECTED_RESULT_TYPES[resultCtorName]) {
//             EXPECTED_RESULT_TYPES[resultCtorName] = {}
//         }
//         const colCtor: ColCtor = Reflect.getMetadata('design:type', prototype, column)
//         assert(
//             VALID_COL_CTORS.includes(colCtor),
//             'Unexpected column type: ' + colCtor.name
//         )
//         EXPECTED_RESULT_TYPES[resultCtorName][column] = colCtor
//     }
// }

function typeCheckResult<R>(resultInfo: pg.FieldDef[], resultCtor: Ctor<R>): void {
    const actualTypes: {[colName: string]: PgTypeId} = {}
    resultInfo.forEach(col => actualTypes[col.name] = col.dataTypeID)

    const expectedTypes = EXPECTED_RESULT_TYPES[resultCtor.name]

    Object.keys(expectedTypes).forEach(expectedColName => {
        assert(
            actualTypes.hasOwnProperty(expectedColName),
            `Column "${expectedColName}" expected by type "${resultCtor.name}" was not selected.`
        )
        assert(
            areTypesCompatible(actualTypes[expectedColName], expectedTypes[expectedColName]),
            `Selected column "${expectedColName}" of type "${PgTypeId[actualTypes[expectedColName]]}" `
                + ` is incompatible with expected type "${expectedTypes[expectedColName].name}".`
        )
    })

    Object.keys(actualTypes).forEach(actualColName => {
        if (!expectedTypes.hasOwnProperty(actualColName)) {
            console.warn(`Selected column "${actualColName}" is not used by type "${resultCtor.name}".`)
        }
    })
}

const COMPATIBLE_TYPES: Map<ColCtor, PgTypeId[]> = new Map()
COMPATIBLE_TYPES.set(Boolean, [PgTypeId.BOOL])
COMPATIBLE_TYPES.set(Number, [PgTypeId.INT2, PgTypeId.INT4, PgTypeId.INT8, PgTypeId.FLOAT4, PgTypeId.FLOAT8, PgTypeId.NUMERIC])
COMPATIBLE_TYPES.set(String, [PgTypeId.CHAR, PgTypeId.BPCHAR, PgTypeId.VARCHAR, PgTypeId.TEXT])
COMPATIBLE_TYPES.set(Date, [PgTypeId.DATE, PgTypeId.TIMESTAMP, PgTypeId.TIMESTAMPTZ])

function areTypesCompatible(resultType: PgTypeId, desiredType: ColCtor): boolean {
    return COMPATIBLE_TYPES.get(desiredType)!.includes(resultType)
}

const pool = new pg.Pool({
    database: 'usda28',
    user: 'kiwibit',
    password: secrets.usda_db,
    host: 'localhost',
    port: 5432,
    max: 16
})
.on('error', (err, client) => {
    console.error('Unexpected error on idle client.', err, client)
    process.exit(-1)
})

type ValidColType = boolean | number | string | Date

type ValidResultType<R> = {
    [_ in keyof R]?: ValidColType
}

interface QueryResult<R> extends pg.QueryResult {
    rows: R[]
}

export function sql<R extends ValidResultType<R>>(resultCtor: Ctor<R>, q: string, params?: ValidColType[]): Promise<QueryResult<R>> {
    return pool
        .query(q, params)
        .then(res => {
            if (global.$debug) {
                typeCheckResult(res.fields, resultCtor)
            }
            return res
        })
        .catch(err => {
            if (global.$debug) {
                const detail = err.detail ? ' ' + err.detail : ''
                const hint = err.hint ? ' ' + err.hint : ''
                const at = err.where ? ' At: ' + err.where + '.' : ''
                const meta = err.table ? ` [${err.table}${err.column ? '.' + err.column : ''}]` : ''
                err.message += ` // Details:${detail}${hint}${at}${meta}`;
            }
            throw new Q.HttpError(500, `Database error: ${err.message}`)
        })
}

export function selectOne<R extends ValidResultType<R>>(resultCtor: Ctor<R>, q: string, params?: ValidColType[]): Promise<R> {
    return sql(resultCtor, q, params).then(res => {
        if (res.rows.length === 0) {
            return Q.err(404, `Item not found.`)
        } else if (res.rows.length > 1) {
            return Q.err(500, `More than one item found while only one was expected.`)
        }
        return Q.ok(res.rows[0])
    })
}

export function selectMany<R extends ValidResultType<R>>(resultCtor: Ctor<R>, q: string, params?: ValidColType[]): Promise<R[]> {
    return sql(resultCtor, q, params).then(res => res.rows)
}

export function insertOne<R extends ValidResultType<R>>(resultCtor: Ctor<R>, data: Partial<R>): Promise<R> {
    const colNames = Object.keys(data)
    const placeholders: string[] = []
    const values: ValidColType[] = []
    colNames.forEach((colName, idx) => {
        placeholders.push('$' + (idx + 1))
        values.push(data[colName as keyof typeof data]!)
    })
    return sql(resultCtor, `insert into ${resultCtor.name}(${colNames.join(', ')}) values (${placeholders.join(', ')}) returning *`, values)
        .then(res => {
            if (res.rowCount === 0) {
                return Q.err(500, `Failed to insert data in "${resultCtor.name}".`)
            } else if (res.rowCount !== 1) {
                return Q.err(500, `Unexpected result inserting data in "${resultCtor.name}": ${res.rowCount} entries inserted.`)
            }
            return Q.ok(res.rows[0])
        })
}

export function updateOne<R extends ValidResultType<R>>(resultCtor: Ctor<R>, data: Partial<R>, params: Partial<R>): Promise<R> {
    const colNames = Object.keys(data)
    const placeholders: string[] = []
    const values: ValidColType[] = []
    colNames.forEach((colName, idx) => {
        placeholders.push('$' + (idx + 1))
        values.push(data[colName as keyof typeof data]!)
    })
    const offset = colNames.length + 1
    const conditions: string[] = []
    Object.keys(params).forEach((colName, idx) => {
        conditions.push(colName + ' = $' + (idx + offset))
        values.push(params[colName as keyof typeof params]!)
    })
    return sql(resultCtor, `update ${resultCtor.name} set (${colNames.join(', ')}) = (${placeholders.join(', ')}) where ${conditions.join(' and ')} returning *`, values)
        .then(res => {
            if (res.rowCount === 0) {
                return Q.err(500, `Failed to update "${resultCtor.name}".`)
            } else if (res.rowCount !== 1) {
                return Q.err(500, `Unexpected result updating "${resultCtor.name}": ${res.rowCount} entries updated.`)
            }
            return Q.ok(res.rows[0])
        })
}

export function deleteOne<R extends ValidResultType<R>>(resultCtor: Ctor<R>, params: Partial<R>): Promise<R> {
    return _delete(resultCtor, params).then(res => {
        if (res.rowCount === 0) {
            return Q.err(500, `Failed to delete entry from "${resultCtor.name}".`)
        } else if (res.rowCount !== 1) {
            return Q.err(400, `Unexpected result deleting from "${resultCtor.name}": ${res.rowCount} entries deleted.`)
        }
        return Q.ok(res.rows[0])
    })
}

export function deleteMany<R extends ValidResultType<R>>(resultCtor: Ctor<R>, params: Partial<R>): Promise<R[]> {
    return _delete(resultCtor, params).then(res => {
        if (res.rowCount === 0) {
            return Q.err(400, `No entries found to be deleted in "${resultCtor.name}".`)
        }
        return Q.ok(res.rows)
    })
}

function _delete<R extends ValidResultType<R>>(resultCtor: Ctor<R>, params: Partial<R>): Promise<QueryResult<R>> {
    const conditions: string[] = []
    const values: ValidColType[] = []
    Object.keys(params).forEach((colName, idx) => {
        conditions.push(colName + ' = $' + (idx + 1))
        values.push(params[colName as keyof typeof params]!)
    })
    return sql(resultCtor, `delete from ${resultCtor.name} where ${conditions.join(' and ')} returning *`, values)
}
