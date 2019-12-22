import * as fs from 'fs'
import * as path from 'path'
import { Client } from 'pg'
import { pgConfig } from './pgConfig'

const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

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
  timestamptz: 'Date',
  bytea: 'Uint8Array'
}

interface ColumnMetadata {
  table_name: string
  column_name: string
  is_nullable: 'YES' | 'NO'
  column_default: string
  udt_name: keyof typeof pgToJsType
}

const client = new Client({ ...pgConfig, database: 'postgres' })

client
  .connect()
  .then(() =>
    client.query(`
        select table_name, column_name, udt_name, is_nullable, column_default
        -- character_maximum_length, is_identity, numeric_precision,
        -- numeric_precision_radix, numeric_scale, datetime_precision,
        -- interval_type, interval_precision
        from information_schema.columns
        where table_schema = 'public'
        order by table_name, ordinal_position
    `)
  )
  .then(res => {
    const columnsByTable: { [table: string]: ColumnMetadata[] } = {}
    res.rows.forEach(col => {
      if (!columnsByTable[col.table_name]) {
        columnsByTable[col.table_name] = []
      }
      columnsByTable[col.table_name].push(col)
    })

    const isOptional = (col: ColumnMetadata) => col.is_nullable === 'YES' || !!col.column_default

    const schema = Object.keys(columnsByTable)
      .map(
        table =>
          `
export type ${table} = {
  ${columnsByTable[table]
    .map(
      col => `${col.column_name}: ${pgToJsType[col.udt_name]}${isOptional(col) ? ' | null' : ''}`
    )
    .join('\n  ')}
}

export const ${table}: Table<${table}> = {
  ${columnsByTable[table]
    .map(
      col =>
        `${col.column_name}: { type: ${ucFirst(pgToJsType[col.udt_name])}, optional: ${
          isOptional(col) ? 'true' : 'false'
        } }`
    )
    .join(',\n  ')}
}`
      )
      .join('\n')

    fs.writeFileSync(
      path.resolve(__dirname, 'schema.ts'),
      `import { Table } from './Table'\n` + schema + '\n'
    )
  })
  .catch(err => console.error('Failed to query schema metadata.', err))
  .finally(() => process.exit(0))
