import { createConnection, Socket } from 'net'
import { createHash } from 'crypto'
import { ConnectionOptions } from 'tls'

// References:
// - https://postgresql.org/docs/13/protocol.html
// - https://github.com/sfackler/rust-postgres/tree/master/postgres-protocol/src
// - https://github.com/porsager/postgres/blob/master/lib
// - https://github.com/postgres/postgres/tree/master/src/backend/libpq
// - https://github.com/postgres/postgres/tree/master/src/backend/utils/adt
// - https://github.com/brianc/node-postgres/blob/master/packages/pg-protocol/src

// TODO For transaction operations, the simple query protocol should be considered for 'BEGIN', 'COMMIT' and 'ROLLBACK' messages

export interface ConnectionPoolOptions {
  host?: string
  port?: number
  database?: string
  username?: string
  password: string
  ssl?: ConnectionOptions
  minConnections?: number
  maxConnections?: number
  connectTimeout?: number
  idleTimeout?: number
  queryTimeout?: number
}

export interface PreparedQuery {
  __kind: 'PreparedQuery'
}

export type QueryResult<R extends { [columnName: string]: any }> = R[] & {
  metadata: {
    rowCount: number
    columns: { name: string, type: ColumnType }[]
  }
}

export function newConnectionPool(options: ConnectionPoolOptions) {
  if (options.host            == null) options.host           = 'localhost'
  if (options.port            == null) options.port           = 5_432
  if (options.database        == null) options.database       = 'postgres'
  if (options.username        == null) options.username       = 'postgres'
  if (options.minConnections  == null) options.minConnections = 2
  if (options.maxConnections  == null) options.maxConnections = 16
  if (options.connectTimeout  == null) options.connectTimeout = 30_000
  if (options.idleTimeout     == null) options.idleTimeout    = 30_000
  if (options.queryTimeout    == null) options.queryTimeout   = 120_000

  return {}
}

export function runStaticQuery(conn: Socket) {
  return (queryParts: TemplateStringsArray, ...values: any[]) => {
    const lastIdx = queryParts.length - 1
    let query = ''
    for (let i = 0; i < lastIdx; ++i) {
      query += queryParts[i] + '$' + (i + 1)
    }
    query += queryParts[lastIdx]

    return runDynamicQuery(conn, query, values)
  }
}

export function runDynamicQuery<T>(conn: Socket, query: string, values: any[]): Promise<QueryResult<T>> {
  return new Promise((resolve, reject) => {})
}

export function prepareQuery(conn: Socket, query: string): Promise<PreparedQuery> {
  return new Promise((resolve, reject) => {})
}

export function runPreparedQuery<T>(conn: Socket, query: PreparedQuery): Promise<QueryResult<T>> {
  return new Promise((resolve, reject) => {})
}

export const enum ColumnType {
  Bit         = 1560,
  Bool        = 16,
  Box         = 603,
  Bytea       = 17,
  Char        = 18,
  Date        = 1082,
  Float4      = 700,
  Float8      = 701,
  Inet        = 869,
  Int2        = 21,
  Int4        = 23,
  Int8        = 20,
  Json        = 114,
  Jsonb       = 3802,
  Line        = 628,
  Lseg        = 601,
  Macaddr     = 829,
  Money       = 790,
  Numeric     = 1700,
  Path        = 602,
  Point       = 600,
  Polygon     = 604,
  Text        = 25,
  Time        = 1083,
  Timestamp   = 1114,
  Timestamptz = 1184,
  Timetz      = 1266,
  Tsvector    = 3614,
  Uuid        = 2950,
  Varbit      = 1562,
  Varchar     = 1043,
  Xml         = 142,
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

enum DescribeOrCloseRequest {
  PreparedStatement = 'S'.charCodeAt(0),
  Portal            = 'P'.charCodeAt(0),
}

const enum AuthenticationResponse {
  Ok                = 0,
  CleartextPassword = 3,
  Md5               = 5,
}

const enum BindFormat {
  Text   = 0,
  Binary = 1,
}

enum TransactionStatus {
  Idle                     = 'I'.charCodeAt(0),
  InTransactionBlock       = 'T'.charCodeAt(0),
  InFailedTransactionBlock = 'E'.charCodeAt(0),
}

function debugMessage(data: Buffer) {
  const msgType = readInt8(data, 0)
  const msgSize = readInt32(data, 1)
  console.debug(
    `[DEBUG] ${1 + msgSize} bytes received (${data.byteLength - (1 + msgSize)} pending)`,
    [BackendMessage[msgType]],
    data.slice(1, 1 + msgSize).toString()
  )
}

establishConnection({
  host: 'localhost',
  port: 5000,
  database: 'postgres',
  username: 'postgres',
  password: 'hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E',
  connectTimeout: 5_000
} as Required<ConnectionPoolOptions>).then(conn => {

  conn.on('data', onData)

  function onData(data: Buffer): void {
    const msgType = readInt8(data, 0) as BackendMessage
    if (msgType === BackendMessage.ParseComplete) {
    } else if (msgType === BackendMessage.ParameterDescription) {
    } else if (msgType === BackendMessage.RowDescription) {
    } else if (msgType === BackendMessage.BindComplete) {
    } else if (msgType === BackendMessage.CommandComplete) {
    } else if (msgType === BackendMessage.DataRow) {
    } else if (msgType === BackendMessage.EmptyQueryResponse) {
    } else if (msgType === BackendMessage.ReadyForQuery) {
    } else if (msgType === BackendMessage.PortalSuspended) {
    } else {
      // console.warn('[WARN] Unexpected message received during query execution phase.')
    }

    debugMessage(data)

    const msgSize = readInt32(data, 1)
    if (data.byteLength > 1 + msgSize) {
      onData(data.slice(1 + msgSize))
    }
  }

  // Simple query
  // conn.write(createQueryMessage('select id, name from foods where id = 9'))

  // Extended query
  // (Parse + Describe? + Bind + Execute + Sync)
  // (Parse + Describe? + Sync) + (Bind + Execute + Sync)
  // (Close + Sync)

  conn.write(createParseMessage('select id, name from foods where id = $1', '', [ColumnType.Int4]))
  // conn.write(createFlushMessage())
  conn.write(createDescribeMessage())
  conn.write(createBindMessage([9]))
  conn.write(createExecuteMessage())
  conn.write(createSyncMessage())
})

// Set up basic error handling, send startup message and authenticate.
function establishConnection(options: Required<ConnectionPoolOptions>): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const conn = createConnection(options.port, options.host)
    const connTimeout = setTimeout(() => conn.destroy(new Error('Connection timed out.')), options.connectTimeout)

    conn.on('connect', () => conn.write(createStartupMessage(options.username, options.database)))

    conn.on('error', err => {
      conn.destroy(err)
      console.error(`[ERROR] ${err.message}`)
      reject(err)
    })

    conn.on('data', data => {
      const msgType = readInt8(data, 0) as BackendMessage
      if (msgType === BackendMessage.ErrorResponse) {
        conn.destroy(new Error(`Error message sent by backend: ${data}`))
      }
    })

    conn.on('data', handleAuthentication)

    function handleAuthentication(data: Buffer): void {
      const msgType = readInt8(data, 0) as BackendMessage
      if (msgType !== BackendMessage.Authentication) {
        console.warn(`[WARN] Unexpected message type sent by backend during connection establishment: "${msgType}".`)
        return
      }

      const authRes = readInt32(data, 5) as AuthenticationResponse
      switch (authRes) {
      case AuthenticationResponse.CleartextPassword:
        conn.write(createCleartextPasswordMessage(options.password))
        break
      case AuthenticationResponse.Md5:
        const salt = data.slice(9)
        conn.write(createMd5PasswordMessage(options.username, options.password, salt))
        break
      case AuthenticationResponse.Ok:
        let msgSize = readInt32(data, 1)
        while (data.byteLength > 1 + msgSize) {
          data = data.slice(1 + msgSize)
          const msgType = readInt8(data, 0) as BackendMessage
          if (msgType === BackendMessage.ReadyForQuery) {
            // const transactionStatus = readInt8(data, 5) as TransactionStatus
            // console.debug('Transaction status:', String.fromCharCode(transactionStatus))
            clearTimeout(connTimeout)
            conn.removeListener('data', handleAuthentication)
            resolve(conn)
          } else {
            console.warn(`[WARN] Unhandled message type sent by backend after succesful authentication: "${msgType}".`)
          }
          msgSize = readInt32(data, 1)
        }
        break
      default:
        conn.destroy(new Error(`Unsupported authentication response sent by backend: "${authRes}".`))
      }
    }
  })
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
  offset = writeString(message, 'user', offset)
  offset = writeString(message, username, offset)

  if (differentNames) {
    offset = writeString(message, 'database', offset)
    offset = writeString(message, database, offset)
  }

  writeInt8(message, 0, offset)

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
  writeString(message, password, offset)

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
  writeString(message, credentialsMd5, offset)

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
  writeString(message, query, offset)

  return message
}

function createParseMessage(query: string, queryId = '', paramTypes: ColumnType[] = []): Buffer {
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
  offset = writeString(message, queryId, offset)
  offset = writeString(message, query, offset)
  offset = writeInt16(message, paramTypes.length, offset)

  for (const t of paramTypes) {
    offset = writeInt32(message, t, offset)
  }

  return message
}

function createDescribeMessage(queryId = ''): Buffer {
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
  writeString(message, queryId, offset)

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

function createBindMessage(values: any[], queryId = '', portal = ''): Buffer {
  let bufferSize
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(portal) + 1
    + Buffer.byteLength(queryId) + 1
    + 2 // Number of parameter format codes
    + 2 // Parameter format code(s)
    + 2 // Number of parameter values
      + 4 * values.length // Length of the parameter values
      + 0 // Values of the parameters (see below)
    + 2 // Number of result-column format codes
    + 2 // Result-column format code(s)

  for (const v of values) {
    if (typeof v === 'number') {
      bufferSize += 4
    } else {
      throw new Error('Tried binding a parameter of an unsupported type: ' + v)
    }
  }

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Bind, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeString(message, portal, offset)
  offset = writeString(message, queryId, offset)
  offset = writeInt16(message, 1, offset)
  offset = writeInt16(message, BindFormat.Binary, offset)
  offset = writeInt16(message, values.length, offset)

  for (const v of values) {
    if (v == null) {
      offset = writeInt32(message, -1, offset)
    } else if (typeof v === 'number') {
      offset = writeInt32(message, 4, offset)
      offset = writeInt32(message, v, offset)
    // } else if (typeof v === 'string') {
    //   offset = writeInt32(message, Buffer.byteLength(v), offset)
    //   offset = writeString(message, v, offset)
    } else {
      throw new Error('Tried binding a parameter of an unsupported type: ' + v)
    }
  }

  offset = writeInt16(message, 1, offset)
  offset = writeInt16(message, BindFormat.Binary, offset)

  return message
}

function createExecuteMessage(portal = ''): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message size
    + Buffer.byteLength(portal) + 1
    + 4 // Maximum number of rows to return

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Execute, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeString(message, portal, offset)
  writeInt32(message, 0, offset)

  return message
}

// https://github.com/nodejs/node/blob/master/lib/internal/buffer.js

function writeInt8(buffer: Uint8Array, value: number, offset: number): number {
  buffer[offset++] = value
  return offset
}

function writeInt16(buffer: Uint8Array, value: number, offset: number): number {
  buffer[offset++] = value >>> 8
  buffer[offset++] = value
  return offset
}

function writeInt32(buffer: Uint8Array, value: number, offset: number): number {
  buffer[offset++] = value >>> 24
  buffer[offset++] = value >>> 16
  buffer[offset++] = value >>> 8
  buffer[offset++] = value
  return offset
}

function writeString(buffer: Buffer, str: string, offset: number): number {
  offset += buffer.write(str, offset)
  buffer[offset++] = 0
  return offset
}

function readInt8(buffer: Uint8Array, offset: number): number {
  const value = buffer[offset]
  return value | (value & 128) * 0x1fffffe
}

// function readInt16(buffer: Uint8Array, offset: number): number {
//   const first = buffer[offset]
//   const last = buffer[offset + 1]
//   const value = first * 256 + last;
//   return value | (value & 32768) * 0x1fffe
// }

function readInt32(buffer: Uint8Array, offset: number): number {
  const first = buffer[offset]
  const last = buffer[offset + 3]
  return (first << 24)
    + buffer[++offset] * 65536
    + buffer[++offset] * 256
    + last
}
