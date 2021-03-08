import { pool } from './pool'
import { ColumnMetadata, getTypeScriptType, ObjectId, PreparedQuery } from './pgeon'

export default function pgeonLoader(source: string) {
  const callback = this.async()
  getSourceWithQueryTypes(source).then(typedSource => callback(null, typedSource))
}

async function getSourceWithQueryTypes(source: string): Promise<string> {
  const matches = Array.from(source.matchAll(/runStaticQuery(<[^>]+?>)?`([^`]*?)`/g))
  if (matches.length === 0) {
    return Promise.resolve(source)
  }

  const promises = matches.reverse().map(match => {
    let i = 1
    const query = match[2].replace(/\$\{[^\}]+?\}/g, () => '$' + i++)
    return pool
      .prepareQuery(query)
      .then(getQueryType)
      .then(type => ({ type, match }))
  })

  for await (const { type, match } of promises) {
    const startIdx = match.index + 'runStaticQuery'.length
    source = source.slice(0, startIdx) + type + source.slice(startIdx + (match[1]?.length || 0))
  }

  return source
}

async function getQueryType(q: PreparedQuery): Promise<string> {
  const rowType = await getRowType(q.columnMetadata)
  const paramsType = getParamsType(q.paramTypes)
  return `<${rowType}, ${paramsType}>`
}

async function getRowType(columnMetadata: ColumnMetadata[]): Promise<string> {
  const tableIds = columnMetadata.map(col => col.tableId).filter(x => !!x)
  const colPositions = columnMetadata.map(col => col.positionInTable).filter(x => !!x)

  if (columnMetadata.length === 0 || tableIds.length === 0) {
    return Promise.resolve('{}')
  }

  const { rows } = await pool.runStaticQuery`
    select cls.oid as table_oid, col.ordinal_position, col.is_nullable
    from information_schema.columns col
    join pg_catalog.pg_class cls on (cls.relname = col.table_name)
    where col.table_schema = 'public'
    and cls.oid = any(${tableIds}::int[])
    and col.ordinal_position = any(${colPositions})
  `

  const colTypes: string[] = []
  for (const col of columnMetadata) {
    let colType = `${col.name}: ${getTypeScriptType(col.type)}`
    if (col.tableId) {
      const row = rows.find(r => r.table_oid === col.tableId && r.ordinal_position === col.positionInTable)
      if (row?.is_nullable === 'YES') {
        colType += ' | null'
      }
    }
    colTypes.push(colType)
  }

  return '{ ' + colTypes.join(', ') + ' }'
}

// async function getRowType(columnMetadata: ColumnMetadata[]): Promise<string> {
//   const colTypes: string[] = []
//   for (const col of columnMetadata) {
//     let colType = `${col.name}: ${getTypeScriptType(col.type)}`
//     if (col.tableId) {
//       const { rows } = await pool.runStaticQuery`
//         select is_nullable
//         from information_schema.columns
//         where table_schema = 'public'
//         and table_name = (select relname from pg_catalog.pg_class where oid = ${col.tableId})
//         and ordinal_position = ${col.positionInTable}
//       `
//       if (rows.length === 0 || rows[0].is_nullable === 'YES') {
//         colType += ' | null'
//       }
//     }
//     colTypes.push(colType)
//   }

//   return '{ ' + colTypes.join(', ') + ' }'
// }

function getParamsType(paramTypes: ObjectId[]): string {
  return '[' + paramTypes.map(getTypeScriptType).join(', ') + ']'
}
