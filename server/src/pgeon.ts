import { createConnection, Socket } from 'net'
import { createHash } from 'crypto'
import { ConnectionOptions } from 'tls'

// References:
// - https://postgresql.org/docs/13/protocol.html
// - https://github.com/postgres/postgres/tree/master/src/backend/libpq
// - https://github.com/postgres/postgres/tree/master/src/backend/utils/adt
// - https://github.com/sfackler/rust-postgres/tree/master/postgres-protocol/src
// - https://github.com/brianc/node-pg-types/blob/master/lib/binaryParsers.js
// - https://github.com/nodejs/node/blob/master/lib/internal/buffer.js

// Features:
// - Portal suspension
// - Transactions
// - Transaction status messages
// - Query cancellation
// - Data types (numeric, arrays)
// - Type checking (?)
// - Timeouts
// - Authentication mechanisms
// - Cursors, copy, function calls
// - Performance
//   - Replace promises with callbacks
//   - WASM
//   - Process static queries at compile time (calculate MD5 and identical parameters, avoid extra function call)

interface ConnectionPoolOptions {
  host?: string
  port?: number
  database?: string
  username?: string
  password: string
  ssl?: ConnectionOptions
  minConnections?: number
  maxConnections?: number
  // connectTimeout?: number
  // idleTimeout?: number
  // queryTimeout?: number
  // prepareTimeout?: number
}

export interface QueryMetadata {
  paramTypes: ObjectId[]
  columnMetadata: ColumnMetadata[]
}

interface PreparedQuery extends QueryMetadata {
  queryId: string
}

type Row = {
  [columnName: string]: ColumnValue | Buffer
}

type ColumnValue = any // undefined | null | boolean | number | string

interface ColumnMetadata {
  name: string
  type: ObjectId
  tableId?: number
  positionInTable?: number
}

interface QueryResult<R extends Row> {
  rows: R[]
  rowsAffected: number
  columnMetadata: ColumnMetadata[]
}

interface Connection extends Socket {
  processId: number
  cancelKey: number
  preparedQueries: {
    [queryId: string]: PreparedQuery
  }
}

export function newConnectionPool(options: ConnectionPoolOptions) {
  if (options.host            == null) options.host           = 'localhost'
  if (options.port            == null) options.port           = 5_432
  if (options.database        == null) options.database       = 'postgres'
  if (options.username        == null) options.username       = 'postgres'
  if (options.minConnections  == null) options.minConnections = 2
  if (options.maxConnections  == null) options.maxConnections = 8
  // if (options.connectTimeout  == null) options.connectTimeout = 30_000
  // if (options.idleTimeout     == null) options.idleTimeout    = 60_000
  // if (options.queryTimeout    == null) options.queryTimeout   = 120_000
  // if (options.prepareTimeout  == null) options.prepareTimeout = 10_000

  let connCount = 0
  const connPool: Promise<Connection>[] = []
  const connQueue: ((connPromise: Promise<Connection>) => void)[] = []

  for (let i = connCount; i < options.minConnections; ++i) {
    putConnectionInPool()
  }

  function putConnectionInPool(delay = 1) {
    const connPromise = openConnection(options as Required<ConnectionPoolOptions>)
    connPromise.then(conn => {
      conn.on('close', () => {
        const idx = connPool.indexOf(connPromise)
        if (idx > -1) {
          connPool.splice(idx, 1)
        }
        connCount--
        if (connCount < options.minConnections) {
          setTimeout(() => putConnectionInPool(Math.min(1024, delay * 2)), delay)
        }
      })
    })
    connCount++
    onConnectionAvailable(connPromise)
  }

  function takeConnectionFromPool(): Promise<Connection> {
    if (connPool.length === 0 && connCount < options.maxConnections) {
      putConnectionInPool()
    }
    return connPool.length > 0
      ? connPool.pop()
      : new Promise(resolve => connQueue.push(resolve))
  }

  function onConnectionAvailable(connPromise: Promise<Connection>) {
    if (connQueue.length > 0) {
      connQueue.shift()(connPromise)
    } else {
      connPool.push(connPromise)
    }
  }

  function cancelQuery({ processId, cancelKey }: Connection) {
    const conn = createConnection(options.port, options.host)
    conn.on('connect', () => conn.write(createCancelRequestMessage(processId, cancelKey)))
  }

  async function runDynamicQuery<R extends Row = Row, V extends ColumnValue[] = ColumnValue[]>(query: string, values: V): Promise<QueryResult<R>> {
    const connPromise = takeConnectionFromPool()
    const conn = await connPromise
    const { preparedQueries } = conn
    const queryId = md5(query)
    preparedQueries[queryId] = preparedQueries[queryId] || await prepareQuery(conn, query, queryId)
    const result = await runPreparedQuery<R, V>(conn, preparedQueries[queryId], values)
    onConnectionAvailable(connPromise)
    return result
  }

  return {
    async getQueryMetadata(query: string): Promise<QueryMetadata> {
      const connPromise = takeConnectionFromPool()
      const conn = await connPromise
      const { preparedQueries } = conn
      const queryId = md5(query)
      preparedQueries[queryId] = preparedQueries[queryId] || await prepareQuery(conn, query, queryId)
      onConnectionAvailable(connPromise)
      return preparedQueries[queryId]
    },
    runDynamicQuery,
    runStaticQuery<R extends Row = Row, V extends ColumnValue[] = ColumnValue[]>(queryParts: TemplateStringsArray, ...values: V): Promise<QueryResult<R>> {
      const lastIdx = values.length
      const uniqueValues = [] as V
      const argIndices: number[] = []

      out:
      for (let i = 0; i < lastIdx; ++i) {
        const val = values[i]
        const argIdx = uniqueValues.length
        for (let j = 0; j < argIdx; ++j) {
          if (val === uniqueValues[j]) {
            argIndices.push(j + 1)
            continue out
          }
        }
        argIndices.push(argIdx + 1)
        uniqueValues.push(val)
      }

      let query = ''
      for (let i = 0; i < lastIdx; ++i) {
        query += queryParts[i] + '$' + argIndices[i]
      }
      query += queryParts[lastIdx]

      return runDynamicQuery<R, V>(query, uniqueValues)
    },
    beginTransaction() {
      const connPromise = takeConnectionFromPool()
      return connPromise.then(conn => {
        // TODO In each case, wait until a reply.
        // TODO onConnectionAvailable(connPromise)
        conn.write(createQueryMessage('begin'))
        return {
          commit() { conn.write(createQueryMessage('commit')) },
          rollback() { conn.write(createQueryMessage('rollback')) }
        }
      })
    }
  }
}

function openConnection(options: Required<ConnectionPoolOptions>): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const conn = createConnection(options.port, options.host) as Connection

    // conn.setTimeout(options.idleTimeout)
    // conn.on('timeout', () => {
    //   const err = new Error('Closing the connection as it has been idle for too long.')
    //   conn.destroy(err)
    //   reject(err)
    // })

    conn.on('connect', () => conn.write(createStartupMessage(options.username, options.database)))

    conn.on('error', err => {
      conn.destroy(err)
      reject(err)
    })

    conn.on('data', data => {
      const msgType = readInt8(data, 0) as BackendMessage
      if (msgType === BackendMessage.NoticeResponse) {
        const notice = parseErrorResponse(data)
        console.log('[NOTICE]', notice)
      }
    })

    conn.on('data', handleStartupPhase)

    let authOk = false

    function handleStartupPhase(data: Buffer): void {
      const msgType = readInt8(data, 0) as BackendMessage

      if (msgType === BackendMessage.Authentication) {
        const authRes = readInt32(data, 5) as AuthenticationResponse
        if (authRes === AuthenticationResponse.Md5) {
          const salt = data.slice(9)
          conn.write(createMd5PasswordMessage(options.username, options.password, salt))
        } else if (authRes === AuthenticationResponse.Ok) {
          authOk = true
        } else if (authRes === AuthenticationResponse.CleartextPassword) {
          conn.write(createCleartextPasswordMessage(options.password))
        } else {
          const err = new Error(`Unsupported authentication response sent by server: "${AuthenticationResponse[authRes] || authRes}".`)
          conn.destroy(err)
          return reject(err)
        }
      }
      else if (msgType === BackendMessage.ParameterStatus) {
        const paramName = readCString(data, 5)
        const paramValue = readCString(data, 5 + paramName.length + 1)
        // console.debug(`[DEBUG] ${paramName} = ${paramValue}`)
      }
      else if (msgType === BackendMessage.BackendKeyData) {
        conn.processId = readInt32(data, 5)
        conn.cancelKey = readInt32(data, 9)
      }
      else if (msgType === BackendMessage.ReadyForQuery) {
        // const txStatus = readInt8(data, 5) as TransactionStatus
        if (authOk) {
          conn.removeListener('data', handleStartupPhase)
          conn.preparedQueries = {}
          resolve(conn)
        } else {
          const err = new Error('Authentication could not be completed.')
          conn.destroy(err)
          return reject(err)
        }
      }
      else if (msgType === BackendMessage.ErrorResponse) {
        const msg = parseErrorResponse(data).find(err => err.type === ErrorResponseType.Message)?.value || ''
        const err = new Error(`Error received from server during startup phase: "${msg}".`)
        conn.destroy(err)
        return reject(err)
      }
      else if (msgType === BackendMessage.NegotiateProtocolVersion) {
        const minorVersion = readInt32(data, 5)
        const unrecognizedOptions: string[] = []
        const unrecognizedOptionsCount = readInt32(data, 9)
        let offset = 13
        for (let i = 0; i < unrecognizedOptionsCount; ++i) {
          const opt = readCString(data, offset)
          unrecognizedOptions.push(opt)
          offset += opt.length
        }
        const unrecognizedOptionsMsg = unrecognizedOptions.length === 0 ? '' : ` The following options were not recognized by the server: ${unrecognizedOptions.join(', ')}.`
        const err = new Error(`The Postgres server does not support protocol versions greather than 3.${minorVersion}.${unrecognizedOptionsMsg}`)
        conn.destroy(err)
        return reject(err)
      }
      else {
        console.warn(`[WARN] Unexpected message type sent by server during startup phase: "${BackendMessage[msgType] || msgType}".`)
      }

      const msgSize = 1 + readInt32(data, 1)
      if (data.byteLength > msgSize) {
        handleStartupPhase(data.slice(msgSize))
      }
    }
  })
}

function prepareQuery(conn: Connection, query: string, queryId: string, paramTypes?: ObjectId[]): Promise<PreparedQuery> {
  return new Promise((resolve, reject) => {
    conn.on('data', handleQueryPreparation)

    const shouldFetchParamTypes = paramTypes == null
    if (shouldFetchParamTypes) {
      paramTypes = []
    }

    let leftover: Buffer
    let parseCompleted = false
    let paramTypesFetched = false
    let columnMetadataFetched = false

    const columnMetadata: ColumnMetadata[] = []

    function handleQueryPreparation(data: Buffer): void {
      if (leftover) {
        data = Buffer.concat([leftover, data])
        leftover = undefined
      }

      if (data.byteLength <= 5) {
        leftover = data
        return
      }

      const msgSize = 1 + readInt32(data, 1)
      if (msgSize > data.byteLength) {
        leftover = data
        return
      }

      const msgType = readInt8(data, 0) as BackendMessage
      if (msgType === BackendMessage.ParseComplete) {
        parseCompleted = true
      }
      else if (msgType === BackendMessage.ParameterDescription) {
        if (shouldFetchParamTypes) {
          const paramCount = readInt16(data, 5)
          let offset = 7
          for (let i = 0; i < paramCount; ++i) {
            const paramType = readInt32(data, offset)
            offset += 4
            paramTypes.push(paramType)
          }
        }
        paramTypesFetched = true
      }
      else if (msgType === BackendMessage.RowDescription) {
        const colCount = readInt16(data, 5)
        let offset = 7
        for (let i = 0; i < colCount; ++i) {
          const name            = readCString(data, offset)
          const tableId         = readInt32(data, offset += name.length + 1) || undefined
          const positionInTable = readInt16(data, offset += 4) || undefined
          const type            = readInt32(data, offset += 2)
          const typeSize        = readInt16(data, offset += 4)
          const typeModifier    = readInt32(data, offset += 2)
          const format          = readInt16(data, offset += 4) as WireFormat
          offset += 2
          columnMetadata.push({ name, type, tableId, positionInTable })
        }
        columnMetadataFetched = true
      }
      else if (msgType === BackendMessage.ReadyForQuery) {
        conn.removeListener('data', handleQueryPreparation)
        if (parseCompleted && paramTypesFetched && columnMetadataFetched) {
          resolve({ queryId, paramTypes, columnMetadata })
        } else {
          reject(new Error('Failed to parse query.'))
        }
        return
      }
      else if (msgType === BackendMessage.ErrorResponse) {
        const msg = parseErrorResponse(data).find(err => err.type === ErrorResponseType.Message)?.value || ''
        const err = new Error(`Error received from server during query preparation phase: "${msg}".`)
        return reject(err)
      }
      else {
        console.warn('[WARN] Unexpected message received during query preparation phase: ' + (BackendMessage[msgType] || msgType))
      }

      if (data.byteLength > msgSize) {
        handleQueryPreparation(data.slice(msgSize))
      }
    }

    conn.write(createParseMessage(query, queryId, paramTypes))
    conn.write(createDescribeMessage(queryId))
    conn.write(createSyncMessage())
  })
}

function runPreparedQuery<R extends Row, V extends ColumnValue[]>(conn: Connection, query: PreparedQuery, paramValues: V): Promise<QueryResult<R>> {
  return new Promise((resolve, reject) => {
    conn.on('data', handleQueryExecution)

    let leftover: Buffer
    let bindingCompleted = false
    let commandCompleted = false

    const { columnMetadata } = query
    const rows: R[] = []
    let rowsAffected = 0

    function handleQueryExecution(data: Buffer): void {
      if (leftover) {
        data = Buffer.concat([leftover, data])
        leftover = undefined
      }

      if (data.byteLength <= 5) {
        leftover = data
        return
      }

      const msgSize = 1 + readInt32(data, 1)
      if (msgSize > data.byteLength) {
        leftover = data
        return
      }

      const msgType = readInt8(data, 0) as BackendMessage
      if (msgType === BackendMessage.DataRow) {
        const valueCount = readInt16(data, 5)
        if (columnMetadata.length !== valueCount) {
          conn.destroy(new Error(`Received ${valueCount} column values, but ${columnMetadata.length} column descriptions.`))
          return
        }

        const row: Row = {}
        let offset = 7
        for (let i = 0; i < valueCount; ++i) {
          const column = columnMetadata[i]
          const valueSize = readInt32(data, offset)
          offset += 4
          if (valueSize === -1) {
            row[column.name] = null
            continue
          }

          const value = data.slice(offset, offset += valueSize)
          switch (column.type) {
          case ObjectId.Bool:
            row[column.name] = value[0] !== 0
            break
          case ObjectId.Int2:
            row[column.name] = readInt16(value, 0)
            break
          case ObjectId.Int4:
            row[column.name] = readInt32(value, 0)
            break
          case ObjectId.Int8:
            row[column.name] = readInt64(value, 0)
            break
          case ObjectId.Float4:
            row[column.name] = readFloat32(value, 0)
            break
          case ObjectId.Float8:
            row[column.name] = readFloat64(value, 0)
            break
          case ObjectId.Oid:
            row[column.name] = readUint32(value, 0)
            break
          case ObjectId.Char:
          case ObjectId.Varchar:
          case ObjectId.Text:
          case ObjectId.Bpchar:
          case ObjectId.Name:
            row[column.name] = value.toString()
            break
          default:
            console.warn(`[WARN] Unsupported column data type: ${ObjectId[column.type] || column.type}.`)
            row[column.name] = value
          }
        }

        rows.push(row as R)
      }
      else if (msgType === BackendMessage.BindComplete) {
        bindingCompleted = true
      }
      else if (msgType === BackendMessage.CommandComplete) {
        const commandTagParts = readCString(data, 5).split(' ')
        const commandTag = commandTagParts[0] as CommandTag
        rowsAffected = parseInt(commandTagParts[commandTagParts.length - 1], 10)
        commandCompleted = true
      }
      else if (msgType === BackendMessage.ReadyForQuery) {
        conn.removeListener('data', handleQueryExecution)
        if (bindingCompleted && commandCompleted) {
          return resolve({ rows, rowsAffected, columnMetadata })
        } else {
          return reject(new Error('Failed to execute query.'))
        }
      }
      else if (msgType === BackendMessage.ErrorResponse) {
        const msg = parseErrorResponse(data).find(err => err.type === ErrorResponseType.Message)?.value || ''
        const err = new Error(`Error received from server during query execution phase: "${msg}".`)
        return reject(err)
      }
      else if (msgType === BackendMessage.EmptyQueryResponse) {
        return reject(new Error('Empty query received.'))
      }
      else if (msgType === BackendMessage.PortalSuspended) {
        conn.write(createExecuteMessage(''))
        conn.write(createSyncMessage())
      }
      else {
        console.warn(`[WARN] Unexpected message received during prepared query execution phase: ${BackendMessage[msgType] || msgType}.`)
      }

      if (data.byteLength > msgSize) {
        handleQueryExecution(data.slice(msgSize))
      }
    }

    conn.write(createBindMessage(paramValues, query, ''))
    conn.write(createExecuteMessage(''))
    conn.write(createSyncMessage())
  })
}

interface ParsedError {
  type: ErrorResponseType
  value: string
}

function parseErrorResponse(data: Buffer): ParsedError[] {
  const msgSize = 1 + readInt32(data, 1)
  const errors: ParsedError[] = []
  let offset = 5
  while (offset < msgSize) {
    const type = readInt8(data, offset++) as ErrorResponseType
    if (type !== 0) {
      const value = readCString(data, offset)
      offset += Buffer.byteLength(value) + 1
      errors.push({ type, value })
    }
  }
  return errors
}

function createStartupMessage(username: string, database: string): Buffer {
  let size
    = 4 // Message size
    + 4 // Protocol version
    + 5 // "user" + 1
    + Buffer.byteLength(username) + 1
    + 1 // Null terminator

  const differentNames = database !== username
  if (differentNames) {
    size += 9 // "database" + 1
    size += Buffer.byteLength(database) + 1
  }

  const message = Buffer.allocUnsafe(size)
  let offset = 0

  offset = writeInt32(message, size, offset)
  offset = writeInt32(message, 196_608, offset) // Protocol version 3.0
  offset = writeCString(message, 'user', offset)
  offset = writeCString(message, username, offset)

  if (differentNames) {
    offset = writeCString(message, 'database', offset)
    offset = writeCString(message, database, offset)
  }

  writeInt8(message, 0, offset)

  return message
}

function createCancelRequestMessage(processId: number, cancelKey: number): Buffer {
  const size = 16
  const message = Buffer.allocUnsafe(size)
  writeInt32(message, size, 0)
  writeInt32(message, 80877102, 4) // Cancel request code
  writeInt32(message, processId, 8)
  writeInt32(message, cancelKey, 12)
  return message
}

function createCleartextPasswordMessage(password: string) {
  const size
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(password) + 1

  const message = Buffer.allocUnsafe(size)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.PasswordMessage, offset)
  offset = writeInt32(message, size - 1, offset)
  writeCString(message, password, offset)

  return message
}

function createMd5PasswordMessage(username: string, password: string, salt: Buffer) {
  const credentialsMd5 = 'md5' + md5(Buffer.concat([Buffer.from(md5(password + username)), salt]))
  const size
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(credentialsMd5) + 1

  const message = Buffer.allocUnsafe(size)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.PasswordMessage, offset)
  offset = writeInt32(message, size - 1, offset)
  writeCString(message, credentialsMd5, offset)

  return message
}

function md5(x: string | Buffer) {
  return createHash('md5').update(x).digest('hex')
}

function createQueryMessage(query: string): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(query) + 1

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Query, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  writeCString(message, query, offset)

  return message
}

function createParseMessage(query: string, queryId: string, paramTypes: ObjectId[]): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(queryId) + 1
    + Buffer.byteLength(query) + 1
    + 2 // Number of parameter data
    + paramTypes.length * 4

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Parse, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeCString(message, queryId, offset)
  offset = writeCString(message, query, offset)
  offset = writeInt16(message, paramTypes.length, offset)

  for (const t of paramTypes) {
    offset = writeInt32(message, t, offset)
  }

  return message
}

function createDescribeMessage(queryId: string): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size
    + 1 // Describe message type
    + Buffer.byteLength(queryId) + 1

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Describe, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeInt8(message, DescribeOrCloseRequest.PreparedStatement, offset)
  writeCString(message, queryId, offset)

  return message
}

function createSyncMessage(): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Sync, offset)
  writeInt32(message, bufferSize - 1, offset)

  return message
}

function createFlushMessage(): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Flush, offset)
  writeInt32(message, bufferSize - 1, offset)

  return message
}

function createBindMessage(paramValues: any[], query: PreparedQuery, portal: string): Buffer {
  const { queryId, paramTypes } = query

  let bufferSize
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(portal) + 1
    + Buffer.byteLength(queryId) + 1
    + 2 // Number of parameter format codes
    + 2 // Parameter format code(s)
    + 2 // Number of parameter values
      + 4 * paramValues.length // Length of the parameter values
      + 0 // Values of the parameters (see below)
    + 2 // Number of result-column format codes
    + 2 // Result-column format code(s)

  for (let i = 0; i < paramValues.length; ++i) {
    if (paramValues[i] == null) {
      continue
    }

    switch (paramTypes[i]) {
    case ObjectId.Bool:
      bufferSize += 1
      break
    case ObjectId.Int2:
      bufferSize += 2
      break
    case ObjectId.Int4:
    case ObjectId.Float4:
    case ObjectId.Oid:
      bufferSize += 4
      break
    case ObjectId.Int8:
    case ObjectId.Float8:
      bufferSize += 8
      break
    case ObjectId.Char:
    case ObjectId.Varchar:
    case ObjectId.Text:
    case ObjectId.Bpchar:
    case ObjectId.Name:
      bufferSize += Buffer.byteLength(paramValues[i])
      break
    case ObjectId.Int4Array:
      bufferSize += 20 + paramValues[i].length * 8
      break
    default:
      throw new Error(`Tried binding a parameter of an unsupported type: ${ObjectId[paramTypes[i]] || paramTypes[i]}`)
    }
  }

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Bind, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeCString(message, portal, offset)
  offset = writeCString(message, queryId, offset)
  offset = writeInt16(message, 1, offset)
  offset = writeInt16(message, WireFormat.Binary, offset)
  offset = writeInt16(message, paramValues.length, offset)

  for (let i = 0; i < paramValues.length; ++i) {
    const v = paramValues[i]
    if (v == null) {
      offset = writeInt32(message, -1, offset)
      continue
    }

    switch (paramTypes[i]) {
    case ObjectId.Bool:
      offset = writeInt32(message, 1, offset)
      offset = writeInt8(message, +v, offset)
      break
    case ObjectId.Int2:
      offset = writeInt32(message, 2, offset)
      offset = writeInt16(message, v, offset)
      break
    case ObjectId.Int4:
      offset = writeInt32(message, 4, offset)
      offset = writeInt32(message, v, offset)
      break
    case ObjectId.Oid:
      offset = writeInt32(message, 4, offset)
      offset = writeInt32(message, v, offset) // FIXME
      break
    case ObjectId.Int8:
      offset = writeInt32(message, 8, offset)
      offset = writeInt64(message, v, offset)
      break
    case ObjectId.Float4:
      offset = writeInt32(message, 4, offset)
      offset = writeFloat32(message, v, offset)
      break
    case ObjectId.Float8:
      offset = writeInt32(message, 8, offset)
      offset = writeFloat64(message, v, offset)
      break
    case ObjectId.Char:
    case ObjectId.Varchar:
    case ObjectId.Text:
    case ObjectId.Bpchar:
    case ObjectId.Name:
      offset = writeInt32(message, Buffer.byteLength(v), offset)
      offset += message.write(v, offset)
      break
    case ObjectId.Int4Array:
      offset = writeInt32(message, 20 + paramValues[i].length * 8, offset)
      offset = writeInt32Array(message, v, offset)
      break
    default:
      throw new Error(`Tried binding a parameter of an unsupported type: ${ObjectId[paramTypes[i]] || paramTypes[i]}`)
    }
  }

  offset = writeInt16(message, 1, offset)
  offset = writeInt16(message, WireFormat.Binary, offset)

  return message
}

function createExecuteMessage(portal: string): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(portal) + 1
    + 4 // Maximum number of rows to return

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Execute, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeCString(message, portal, offset)
  writeInt32(message, 0, offset)

  return message
}

export function getTypeScriptType(pgType: ObjectId) {
  switch (pgType) {
  case ObjectId.Bool:
    return 'boolean'
  case ObjectId.Int2:
  case ObjectId.Int4:
  case ObjectId.Float4:
  case ObjectId.Float8:
    return 'number'
  case ObjectId.Int8:
    return 'bigint'
  case ObjectId.Char:
  case ObjectId.Varchar:
  case ObjectId.Text:
  case ObjectId.Bpchar:
  case ObjectId.Name:
    return 'string'
  case ObjectId.Int4Array:
    return 'number[]'
  case ObjectId.Bytea:
    return 'Uint8Array'
  default:
    console.warn(`[WARN] Tried binding a parameter of an unsupported type: ${ObjectId[pgType] || pgType}`)
    return 'any'
  }
}

function readInt8(buffer: Uint8Array, offset: number): number {
  const value = buffer[offset]
  return value | (value & 128) * 0x1fffffe
}

function writeInt8(buffer: Uint8Array, value: number, offset: number): number {
  buffer[offset++] = value
  return offset
}

function readInt16(buffer: Uint8Array, offset: number): number {
  const first = buffer[offset]
  const last = buffer[offset + 1]
  const value = first * 256 + last;
  return value | (value & 32768) * 0x1fffe
}

function writeInt16(buffer: Uint8Array, value: number, offset: number): number {
  buffer[offset++] = value >>> 8
  buffer[offset++] = value
  return offset
}

function readInt32(buffer: Uint8Array, offset: number): number {
  const first = buffer[offset]
  const last = buffer[offset + 3]
  return (first << 24)
    + buffer[++offset] * 65536
    + buffer[++offset] * 256
    + last
}

function writeInt32(buffer: Uint8Array, value: number, offset: number): number {
  buffer[offset++] = value >>> 24
  buffer[offset++] = value >>> 16
  buffer[offset++] = value >>> 8
  buffer[offset++] = value
  return offset
}

function writeInt32Array(buffer: Buffer, values: number[], offset: number): number {
  offset = writeInt32(buffer, 1, offset) // Number of dimensions
  offset = writeInt32(buffer, 0, offset) // Has nulls?
  offset = writeInt32(buffer, ObjectId.Int4, offset) // Element type
  offset = writeInt32(buffer, values.length, offset) // Size of first dimension
  offset = writeInt32(buffer, 1, offset) // Offset (starting index) of first dimension
  for (const v of values) {
    offset = writeInt32(buffer, 4, offset)
    offset = writeInt32(buffer, v, offset)
  }
  return offset
}

function readUint32(buffer: Uint8Array, offset: number): number {
  return buffer[offset] * 16777216 +
    buffer[++offset] * 65536 +
    buffer[++offset] * 256 +
    buffer[++offset]
}

function readInt64(buffer: Uint8Array, offset: number): bigint {
  const value =
    (buffer[offset] << 24) + // Overflow
    buffer[++offset] * 65536 +
    buffer[++offset] * 256 +
    buffer[++offset]

  return (BigInt(value) << 32n) +
    BigInt(
      buffer[++offset] * 16777216 +
      buffer[++offset] * 65536 +
      buffer[++offset] * 256 +
      buffer[++offset]
    )
}

function writeInt64(buffer: Uint8Array, value: bigint, offset: number): number {
  let lo = Number(value & 0xffffffffn)
  buffer[offset + 7] = lo
  lo = lo >> 8
  buffer[offset + 6] = lo
  lo = lo >> 8
  buffer[offset + 5] = lo
  lo = lo >> 8
  buffer[offset + 4] = lo

  let hi = Number(value >> 32n & 0xffffffffn)
  buffer[offset + 3] = hi
  hi = hi >> 8
  buffer[offset + 2] = hi
  hi = hi >> 8
  buffer[offset + 1] = hi
  hi = hi >> 8
  buffer[offset] = hi

  return offset + 8
}

const float32Arr = new Float32Array(1)
const uint8Float32Arr = new Uint8Array(float32Arr.buffer)

const float64Arr = new Float64Array(1)
const uint8Float64Arr = new Uint8Array(float64Arr.buffer)

float32Arr[0] = -1
const bigEndian = uint8Float32Arr[3] === 0

const readFloat32 = bigEndian ? function readFloat32(buffer: Uint8Array, offset: number): number {
  uint8Float32Arr[0] = buffer[offset]
  uint8Float32Arr[1] = buffer[++offset]
  uint8Float32Arr[2] = buffer[++offset]
  uint8Float32Arr[3] = buffer[++offset]
  return float32Arr[0]
} : function readFloat32(buffer: Uint8Array, offset: number): number {
  uint8Float32Arr[3] = buffer[offset]
  uint8Float32Arr[2] = buffer[++offset]
  uint8Float32Arr[1] = buffer[++offset]
  uint8Float32Arr[0] = buffer[++offset]
  return float32Arr[0]
}

const writeFloat32 = bigEndian ? function writeFloat32(buffer: Uint8Array, value: number, offset: number): number {
  float32Arr[0] = value
  buffer[offset++] = uint8Float32Arr[0]
  buffer[offset++] = uint8Float32Arr[1]
  buffer[offset++] = uint8Float32Arr[2]
  buffer[offset++] = uint8Float32Arr[3]
  return offset
} : function writeFloat32(buffer: Uint8Array, value: number, offset: number): number {
  float32Arr[0] = value
  buffer[offset++] = uint8Float32Arr[3]
  buffer[offset++] = uint8Float32Arr[2]
  buffer[offset++] = uint8Float32Arr[1]
  buffer[offset++] = uint8Float32Arr[0]
  return offset
}

const readFloat64 = bigEndian ? function readFloat64(buffer: Uint8Array, offset: number): number {
  uint8Float64Arr[0] = buffer[offset]
  uint8Float64Arr[1] = buffer[++offset]
  uint8Float64Arr[2] = buffer[++offset]
  uint8Float64Arr[3] = buffer[++offset]
  uint8Float64Arr[4] = buffer[++offset]
  uint8Float64Arr[5] = buffer[++offset]
  uint8Float64Arr[6] = buffer[++offset]
  uint8Float64Arr[7] = buffer[++offset]
  return float64Arr[0]
} : function readFloat64(buffer: Uint8Array, offset: number): number {
  uint8Float64Arr[7] = buffer[offset]
  uint8Float64Arr[6] = buffer[++offset]
  uint8Float64Arr[5] = buffer[++offset]
  uint8Float64Arr[4] = buffer[++offset]
  uint8Float64Arr[3] = buffer[++offset]
  uint8Float64Arr[2] = buffer[++offset]
  uint8Float64Arr[1] = buffer[++offset]
  uint8Float64Arr[0] = buffer[++offset]
  return float64Arr[0]
}

const writeFloat64 = bigEndian ? function writeFloat64(buffer: Uint8Array, value: number, offset: number): number {
  float64Arr[0] = value
  buffer[offset++] = uint8Float64Arr[0]
  buffer[offset++] = uint8Float64Arr[1]
  buffer[offset++] = uint8Float64Arr[2]
  buffer[offset++] = uint8Float64Arr[3]
  buffer[offset++] = uint8Float64Arr[4]
  buffer[offset++] = uint8Float64Arr[5]
  buffer[offset++] = uint8Float64Arr[6]
  buffer[offset++] = uint8Float64Arr[7]
  return offset
} : function writeFloat64(buffer: Uint8Array, value: number, offset: number): number {
  float64Arr[0] = value
  buffer[offset++] = uint8Float64Arr[7]
  buffer[offset++] = uint8Float64Arr[6]
  buffer[offset++] = uint8Float64Arr[5]
  buffer[offset++] = uint8Float64Arr[4]
  buffer[offset++] = uint8Float64Arr[3]
  buffer[offset++] = uint8Float64Arr[2]
  buffer[offset++] = uint8Float64Arr[1]
  buffer[offset++] = uint8Float64Arr[0]
  return offset
}

function readCString(buffer: Buffer, offset: number): string {
  let end = offset
  while (buffer[end] !== 0) {
    ++end
  }
  return buffer.slice(offset, end).toString('ascii')
}

function writeCString(buffer: Buffer, str: string, offset: number): number {
  offset += buffer.write(str, offset, 'ascii')
  buffer[offset++] = 0
  return offset
}

enum FrontendMessage {
  Bind            = 'B'.charCodeAt(0),
  Close           = 'C'.charCodeAt(0),
  CopyData        = 'd'.charCodeAt(0),
  CopyDone        = 'c'.charCodeAt(0),
  Describe        = 'D'.charCodeAt(0),
  Execute         = 'E'.charCodeAt(0),
  Flush           = 'H'.charCodeAt(0),
  FunctionCall    = 'F'.charCodeAt(0),
  Parse           = 'P'.charCodeAt(0),
  PasswordMessage = 'p'.charCodeAt(0),
  Query           = 'Q'.charCodeAt(0),
  Sync            = 'S'.charCodeAt(0),
  Terminate       = 'X'.charCodeAt(0),
}

enum BackendMessage {
  Authentication           = 'R'.charCodeAt(0),
  BackendKeyData           = 'K'.charCodeAt(0),
  BindComplete             = '2'.charCodeAt(0),
  CloseComplete            = '3'.charCodeAt(0),
  CommandComplete          = 'C'.charCodeAt(0),
  CopyBothResponse         = 'W'.charCodeAt(0),
  CopyData                 = 'd'.charCodeAt(0),
  CopyDone                 = 'c'.charCodeAt(0),
  CopyInResponse           = 'G'.charCodeAt(0),
  CopyOutResponse          = 'H'.charCodeAt(0),
  DataRow                  = 'D'.charCodeAt(0),
  EmptyQueryResponse       = 'I'.charCodeAt(0),
  ErrorResponse            = 'E'.charCodeAt(0),
  FunctionCallResponse     = 'V'.charCodeAt(0),
  NegotiateProtocolVersion = 'v'.charCodeAt(0),
  NoData                   = 'n'.charCodeAt(0),
  NoticeResponse           = 'N'.charCodeAt(0),
  NotificationResponse     = 'A'.charCodeAt(0),
  ParameterDescription     = 't'.charCodeAt(0),
  ParameterStatus          = 'S'.charCodeAt(0),
  ParseComplete            = '1'.charCodeAt(0),
  PortalSuspended          = 's'.charCodeAt(0),
  ReadyForQuery            = 'Z'.charCodeAt(0),
  RowDescription           = 'T'.charCodeAt(0),
}

enum ErrorResponseType {
  SeverityLocalized = 'S'.charCodeAt(0),
  Severity          = 'V'.charCodeAt(0),
  Code              = 'C'.charCodeAt(0),
  Message           = 'M'.charCodeAt(0),
  Detail            = 'D'.charCodeAt(0),
  Hint              = 'H'.charCodeAt(0),
  Position          = 'P'.charCodeAt(0),
  InternalPosition  = 'p'.charCodeAt(0),
  Where             = 'W'.charCodeAt(0),
  SchemaName        = 's'.charCodeAt(0),
  ColumnName        = 'c'.charCodeAt(0),
  DateTypeName      = 'd'.charCodeAt(0),
  ConstraintName    = 'n'.charCodeAt(0),
  File              = 'F'.charCodeAt(0),
  Line              = 'L'.charCodeAt(0),
  Routine           = 'R'.charCodeAt(0),
}

enum DescribeOrCloseRequest {
  PreparedStatement = 'S'.charCodeAt(0),
  Portal            = 'P'.charCodeAt(0),
}

enum AuthenticationResponse {
  Ok                = 0,
  CleartextPassword = 3,
  Md5               = 5,
}

const enum WireFormat {
  Text   = 0,
  Binary = 1,
}

enum TransactionStatus {
  Idle                     = 'I'.charCodeAt(0),
  InTransactionBlock       = 'T'.charCodeAt(0),
  InFailedTransactionBlock = 'E'.charCodeAt(0),
}

type CommandTag = 'INSERT' | 'DELETE' | 'UPDATE' | 'SELECT' | 'MOVE' | 'FETCH' | 'COPY'

enum ObjectId {
  Aclitem               = 1033,
  AclitemArray          = 1034,
  Any                   = 2276,
  Anyarray              = 2277,
  Anycompatible         = 5077,
  Anycompatiblearray    = 5078,
  Anycompatiblenonarray = 5079,
  AnycompatibleRange    = 5080,
  Anyelement            = 2283,
  Anyenum               = 3500,
  Anynonarray           = 2776,
  AnyRange              = 3831,
  Bit                   = 1560,
  BitArray              = 1561,
  Bool                  = 16,
  BoolArray             = 1000,
  Box                   = 603,
  BoxArray              = 1020,
  Bpchar                = 1042,
  BpcharArray           = 1014,
  Bytea                 = 17,
  ByteaArray            = 1001,
  Char                  = 18,
  CharArray             = 1002,
  Cid                   = 29,
  CidArray              = 1012,
  Cidr                  = 650,
  CidrArray             = 651,
  Circle                = 718,
  CircleArray           = 719,
  Cstring               = 2275,
  CstringArray          = 1263,
  Date                  = 1082,
  DateArray             = 1182,
  DateRange             = 3912,
  DateRangeArray        = 3913,
  EventTrigger          = 3838,
  FdwHandler            = 3115,
  Float4                = 700,
  Float4Array           = 1021,
  Float8                = 701,
  Float8Array           = 1022,
  GtsVector             = 3642,
  GtsVectorArray        = 3644,
  IndexAmHandler        = 325,
  Inet                  = 869,
  InetArray             = 1041,
  Int2                  = 21,
  Int2Array             = 1005,
  Int2Vector            = 22,
  Int2VectorArray       = 1006,
  Int4                  = 23,
  Int4Array             = 1007,
  Int4Range             = 3904,
  Int4RangeArray        = 3905,
  Int8                  = 20,
  Int8Array             = 1016,
  Int8Range             = 3926,
  Int8RangeArray        = 3927,
  Internal              = 2281,
  Interval              = 1186,
  IntervalArray         = 1187,
  Json                  = 114,
  JsonArray             = 199,
  Jsonb                 = 3802,
  JsonbArray            = 3807,
  Jsonpath              = 4072,
  JsonpathArray         = 4073,
  LanguageHandler       = 2280,
  Line                  = 628,
  LineArray             = 629,
  Lseg                  = 601,
  LsegArray             = 1018,
  Macaddr               = 829,
  Macaddr8              = 774,
  Macaddr8Array         = 775,
  MacaddrArray          = 1040,
  Money                 = 790,
  MoneyArray            = 791,
  Name                  = 19,
  NameArray             = 1003,
  Numeric               = 1700,
  NumericArray          = 1231,
  NumRange              = 3906,
  NumRangeArray         = 3907,
  Oid                   = 26,
  OidArray              = 1028,
  OidVector             = 30,
  OidVectorArray        = 1013,
  Path                  = 602,
  PathArray             = 1019,
  PgDdlCommand          = 32,
  PgDependencies        = 3402,
  PgLsn                 = 3220,
  PgLsnArray            = 3221,
  PgMcvList             = 5017,
  PgNdistinct           = 3361,
  PgNodeTree            = 194,
  PgSnapshot            = 5038,
  PgSnapshotArray       = 5039,
  Point                 = 600,
  PointArray            = 1017,
  Polygon               = 604,
  PolygonArray          = 1027,
  Record                = 2249,
  RecordArray           = 2287,
  Refcursor             = 1790,
  RefcursorArray        = 2201,
  Regclass              = 2205,
  RegclassArray         = 2210,
  Regcollation          = 4191,
  RegcollationArray     = 4192,
  Regconfig             = 3734,
  RegconfigArray        = 3735,
  Regdictionary         = 3769,
  RegdictionaryArray    = 3770,
  Regnamespace          = 4089,
  RegnamespaceArray     = 4090,
  Regoper               = 2203,
  RegoperArray          = 2208,
  Regoperator           = 2204,
  RegoperatorArray      = 2209,
  Regproc               = 24,
  RegprocArray          = 1008,
  Regprocedure          = 2202,
  RegprocedureArray     = 2207,
  Regrole               = 4096,
  RegroleArray          = 4097,
  Regtype               = 2206,
  RegtypeArray          = 2211,
  TableAmHandler        = 269,
  Text                  = 25,
  TextArray             = 1009,
  Tid                   = 27,
  TidArray              = 1010,
  Time                  = 1083,
  TimeArray             = 1183,
  Timestamp             = 1114,
  TimestampArray        = 1115,
  Timestamptz           = 1184,
  TimestamptzArray      = 1185,
  Timetz                = 1266,
  TimetzArray           = 1270,
  Trigger               = 2279,
  TsmHandler            = 3310,
  Tsquery               = 3615,
  TsqueryArray          = 3645,
  TsRange               = 3908,
  TsRangeArray          = 3909,
  TstzRange             = 3910,
  TstzRangeArray        = 3911,
  TsVector              = 3614,
  TsVectorArray         = 3643,
  TxidSnapshot          = 2970,
  TxidSnapshotArray     = 2949,
  Unknown               = 705,
  Uuid                  = 2950,
  UuidArray             = 2951,
  Varbit                = 1562,
  VarbitArray           = 1563,
  Varchar               = 1043,
  VarcharArray          = 1015,
  Void                  = 2278,
  Xid                   = 28,
  Xid8                  = 5069,
  Xid8Array             = 271,
  XidArray              = 1011,
  Xml                   = 142,
  XmlArray              = 143,
}
