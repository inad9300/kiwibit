import * as pg from 'pg'
import {pool} from './pool'
import {PgTypeId} from './PgTypeId'
import {Table, Row, Column} from './Table'
import {Constructor} from './Constructor'
import {WrapperType} from './WrapperType'
import {debug} from './debug'

interface QueryResult<R extends Row> extends pg.QueryResult {
    rows: R[]
}

export function query<R extends Row>(
    text: string,
    params: Column[] = [],
    expectedMetadata?: Table<R>
): Promise<QueryResult<R>> {
    const promise = pool.query(text, params)

    if (debug) {
        promise.then(async res => {
            const assert = await import('assert')

            if (res.command === 'SELECT' || text.toLowerCase().trim().includes(' returning ')) {
                assert(expectedMetadata !== undefined, 'No metadata provided for read query.')
            } else {
                return res
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
                [PgTypeId.TIMESTAMPTZ]: Date,
                [PgTypeId.BYTEA]: Uint8Array
            }

            const actualMetadata = res.fields
            const expectedColumns = Object.keys(expectedMetadata!)

            for (const expectedColumn of expectedColumns) {
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
            }

            for (const actualColumn of actualMetadata) {
                assert(
                    expectedMetadata![actualColumn.name] !== undefined,
                    `Non-expected column "${actualColumn.name}" was selected.`
                )
            }

            const mandatoryColumns = expectedColumns.filter(
                expectedColumn => expectedMetadata![expectedColumn].optional === false
            )

            for (const row of res.rows) {
                for (const col of mandatoryColumns) {
                    assert(
                        row[col] !== null && row[col] !== undefined,
                        `Mandatory column ${col} found to be ${row[col]}.`
                    )
                }
            }

            return res
        })
    }

    return promise
}
