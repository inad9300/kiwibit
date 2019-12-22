import * as pg from 'pg'
// import {pool} from './pool'
import { pgToJsType, PgTypeId } from './pg-types'
import { Table, Row /*, Column */ } from './Table'
// import {debug} from './debug'

interface QueryResult<R extends Row> extends pg.QueryResult {
  rows: R[]
}

/**
 * Execute queries known at compile time.
 */
// export function ssql<R extends Row>(queryParts: TemplateStringsArray, ...params: Column[]): Promise<QueryResult<R>> {
//     let text = ''
//
//     for (let i = 0; i < params.length; i++) {
//         text += queryParts[i] + '$' + (i + 1)
//     }
//
//     text += queryParts[queryParts.length - 1]
//
//     return pool.query(text, params)
// }

/**
 * Execute dynamic queries.
 */
// export function dsql<R extends Row>(text: string, params: Column[] = [], expectedMetadata?: Table<R>): Promise<QueryResult<R>> {
//     const promise = pool.query(text, params)
//
//     if (debug) {
//         promise.then(res => {
//             runtimeQueryVerification(text, res, expectedMetadata)
//         })
//     }
//
//     return promise
// }

export async function runtimeQueryVerification<R extends Row>(
  text: string,
  res: QueryResult<R>,
  expectedMetadata?: Table<R>
) {
  const assert = await import('assert')

  if (
    res.command === 'SELECT' ||
    text
      .toLowerCase()
      .trim()
      .includes(' returning ')
  ) {
    assert(expectedMetadata !== undefined, 'No metadata provided for dynamic read query.')
  } else {
    return
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
      `Incompatible types for column "${expectedColumn}".` +
        ` Expected: ${expectedType.name}.` +
        ` Actual: ${actualType.name} (${PgTypeId[actualColumn.dataTypeID]}).`
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
}
