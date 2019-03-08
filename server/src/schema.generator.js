#!/usr/bin/env node

const fs = require('fs')
const pg = require('pg')
const config = require('../../database/config')
const secrets = require('../../secrets')

const pool = new pg.Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.name,
    password: secrets.db,
    max: 16
})
.on('error', (err, client) => {
    console.error('Unexpected error on idle client.', err, client)
    process.exit(-1)
})

const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

const pgToJsType = {
    bool: 'boolean',
    int2: 'number',
    int4: 'number',
    int8: 'number',
    float4: 'number',
    float8: 'number',
    numeric: 'number',
    text: 'string',
    char: 'string',
    bpchar: 'string',
    varchar: 'string',
    date: 'Date',
    timestamp: 'Date',
    timestamptz: 'Date'
}

pool.query(`
    select table_name, column_name, udt_name, is_nullable
      -- character_maximum_length, is_identity, numeric_precision,
      -- numeric_precision_radix, numeric_scale, datetime_precision,
      -- interval_type, interval_precision
    from information_schema.columns
    where table_catalog = '${config.name}'
    and table_schema = 'public'
    order by table_name, ordinal_position
`).then(res => {
    const columnsByTable = {}
    res.rows.forEach(columnMeta => {
        if (!columnsByTable[columnMeta.table_name]) {
            columnsByTable[columnMeta.table_name] = []
        }
        columnsByTable[columnMeta.table_name].push(columnMeta)
    })

    const schema = Object.keys(columnsByTable).map(table =>
`export type ${table} = {
    ${columnsByTable[table].map(columnMeta => {
        return columnMeta.column_name
            + ': ' + pgToJsType[columnMeta.udt_name]
            + (columnMeta.is_nullable === 'YES' ? ' | null' : '')
    }).join('\n\t')}
}

export const ${table}: RowMetadata<${table}> = {
    ${columnsByTable[table].map(columnMeta => {
        return columnMeta.column_name + ': {'
            + 'type: ' + ucFirst(pgToJsType[columnMeta.udt_name])
            + ', optional: ' + (columnMeta.is_nullable === 'YES' ? 'true' : 'false')
            + '}'
    }).join(',\n\t')}
}`).join('\n\n')

    fs.writeFileSync(
        './schema.ts',
        `import {RowMetadata} from './RowMetadata'\n\n` + schema + '\n'
    )
})
.catch(err => console.error('Failed to query schema metadata.', err))
.finally(() => process.exit(0))
