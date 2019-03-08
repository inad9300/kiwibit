import * as pg from 'pg'
import * as secrets from '../../secrets'
import {PgTypeId} from './PgTypeId'
import {RowMetadata, Row, Column} from './RowMetadata'
import {Constructor} from './Constructor'
import {WrapperType} from './WrapperType'
import {log} from './log'

const pool = new pg.Pool({
    database: 'usda28',
    user: 'kiwibit',
    password: secrets.db,
    host: 'localhost',
    port: 5432,
    max: 16
})
.on('error', (err, client) => {
    log.error('Unexpected error on idle client.', err, client)
    process.exit(-1)
})

interface QueryResult<R extends Row> extends pg.QueryResult {
    rows: R[]
}

export function sql<R extends Row>(
    query: string,
    params: Column[] = [],
    expectedMetadata?: RowMetadata<R>
): Promise<QueryResult<R>> {
    const promise = pool.query(query, params)

    if (global.$debug) {
        promise.then(async res => {
            const assert = await import('assert')

            if (res.command === 'SELECT' || query.toLowerCase().trim().includes(' returning ')) {
                assert(expectedMetadata !== undefined, 'No metadata provided for read query.')
            } else {
                return
            }

            const pgToJsType: {[pgTypeId: number]: Constructor<WrapperType<Exclude<Column, null>>>} = {
                [PgTypeId.BOOL]: Boolean,
                [PgTypeId.INT2]: Number,
                [PgTypeId.INT4]: Number,
                [PgTypeId.INT8]: Number,
                [PgTypeId.FLOAT4]: Number,
                [PgTypeId.FLOAT8]: Number,
                [PgTypeId.NUMERIC]: Number,
                [PgTypeId.TEXT]: String,
                [PgTypeId.CHAR]: String,
                [PgTypeId.BPCHAR]: String,
                [PgTypeId.VARCHAR]: String,
                [PgTypeId.DATE]: Date,
                [PgTypeId.TIMESTAMP]: Date,
                [PgTypeId.TIMESTAMPTZ]: Date
            }

            const actualMetadata = res.fields

            Object.keys(expectedMetadata!).forEach(expectedColumn => {
                const actualColumn = actualMetadata.find(c => c.name === expectedColumn)!
                assert(actualColumn !== undefined, `Expected column "${expectedColumn}" was not selected.`)

                const expectedType = expectedMetadata![expectedColumn].type
                const actualType = pgToJsType[actualColumn.dataTypeID]
                assert(
                    expectedType === actualType,
                    `Incompatible types for column "${expectedColumn}".`
                    + ` Expected: ${expectedType.name}.`
                    + ` Actual: ${actualType.name} (${PgTypeId[actualColumn.dataTypeID]}).`
                )
            })

            actualMetadata.forEach(actualColumn => {
                assert(
                    expectedMetadata![actualColumn.name] !== undefined,
                    `Non-expected column "${actualColumn.name}" was selected.`
                )
            })

            return res
        })
    }

    return promise
}
