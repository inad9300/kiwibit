import { createConnection, Socket } from 'net'
import { createHash } from 'crypto'
import { ConnectionOptions } from 'tls'

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

export type QueryResult<R extends Record<string, any>> = R[] & {
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

// https://www.postgresql.org/docs/13/protocol.html
// https://github.com/postgres/postgres/tree/master/src/backend/utils/adt
// https://github.com/postgres/postgres/tree/master/src/backend/libpq
// https://github.com/porsager/postgres/blob/master/lib
// https://github.com/brianc/node-postgres/blob/master/packages/pg-protocol/src

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

// (Parse + Describe? + Bind + Execute + Sync)
// (Parse + Describe? + Sync) + (Bind + Execute + Sync)
// (Close + Sync)

newConnection({
  host: 'localhost',
  port: 5000,
  database: 'postgres',
  username: 'postgres',
  password: 'hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E',
  connectTimeout: 5_000
} as Required<ConnectionPoolOptions>).then(conn => {
  conn.write(createParseMessage('select 4444'))
  // conn.write(createDescribeMessage())
  // createBindMessage([])
  conn.write(createSyncMessage())
})
.catch(err => console.error(err))

function newConnection(options: Required<ConnectionPoolOptions>): Promise<Socket> {
  return new Promise<Socket>((resolve, reject) => {
    setTimeout(() => reject(new Error('...')), options.connectTimeout)

    const { database, username, password } = options
    const socket = createConnection(options.port, options.host)

    // socket.on('lookup', (err, addr, family, host) => console.debug('socket::lookup', err, addr, family, host))
    socket.on('connect', () => {
      console.debug('socket::connect')
      socket.write(createStartupMessage(username, database))
    })
    // socket.on('drain', () => console.debug('socket::drain'))
    // socket.on('timeout', () => reject(new Error('socket::timeout')))
    socket.on('error', err => reject(err))
    // socket.on('close', hadErr => console.debug('socket::close', hadErr))
    // socket.on('end', () => console.debug('socket::end'))
    socket.on('data', data => {
      console.debug('socket::data', data.byteLength, 'bytes', [String.fromCharCode(readInt8(data, 0))], data.toString())

      const messageType = readInt8(data, 0) as BackendMessage
      switch (messageType) {
      case BackendMessage.Authentication:
        const authResponse = readInt32(data, 5) as AuthenticationResponse
        switch (authResponse) {
        case AuthenticationResponse.Ok:
          let messageSize = readInt32(data, 1)
          while (data.length > 1 + messageSize) {
            data = data.slice(1 + messageSize)
            switch (readInt8(data, 0) as BackendMessage) {
            case BackendMessage.ParameterStatus:
              break
            case BackendMessage.ReadyForQuery:
              const transactionStatus = readInt8(data, 5) as TransactionStatus
              console.debug('Transaction status:', String.fromCharCode(transactionStatus))
              resolve(socket)
              break
            }
            messageSize = readInt32(data, 1)
          }
          break
        case AuthenticationResponse.CleartextPassword:
          socket.write(createCleartextPasswordMessage(password))
          break
        case AuthenticationResponse.Md5:
          const salt = data.slice(9)
          socket.write(createMd5PasswordMessage(username, password, salt))
          break
        default:
          console.error(`Unsupported authentication response sent by backend: "${authResponse}".`)
        }
        break
      case BackendMessage.ReadyForQuery:
        break
      case BackendMessage.ParseComplete:
      case BackendMessage.NoticeResponse:
      case BackendMessage.BackendKeyData:
        break
      case BackendMessage.ErrorResponse:
        reject(new Error(data.toString()))
        break
      default:
        reject(new Error(`Unsupported message type sent by backend: "${String.fromCharCode(messageType)}".`))
        console.debug(data.toString())
      }
    })
  })
}

function createStartupMessage(username: string, database: string): Buffer {
  let size
    = 4 // Message payload
    + 4 // Protocol version
    + 5 // "user" + 1
    + Buffer.byteLength(username) + 1
    + 1 // Null terminator

  const differentNames = database !== username
  if (differentNames) {
    size += 9 // "database" + 1
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
    + 4 // Message payload
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
    + 4 // Message payload
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
    + 4 // Message payload
    + Buffer.byteLength(query) + 1

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Query, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  writeString(message, query, offset)

  return message
}

function createParseMessage(query: string, queryId = '', paramTypes: number[] = []): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message payload
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
    + 4 // Message payload
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
    + 4 // Message payload

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Sync, offset)
  writeInt32(message, bufferSize - 1, offset)

  return message
}

function createBindMessage(values: any[], queryId = '', portal = ''): Buffer {
  const bufferSize
    = 1 // Message type
    + 4 // Message payload
    + Buffer.byteLength(queryId) + 1
    + Buffer.byteLength(portal) + 1
    + 2 // Number of parameter format codes
    + 0 // Paramter format codes
    + 2 // Number of parameter values
      + 0 // Length of the parameter value
      + 0 // Value of the parameter
    + 2 // Number of result-column format codes
    + 0 // Result-column format codes

  const message = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  offset = writeInt8(message, FrontendMessage.Bind, offset)
  offset = writeInt32(message, bufferSize - 1, offset)
  offset = writeString(message, portal, offset)
  offset = writeString(message, queryId, offset)
  offset = writeInt16(message, BindFormat.Binary, offset) // Parameter format
  offset = writeInt16(message, values.length, offset)

  for (const v of values) {
    if (v == null) {
      offset = writeInt32(message, -1, offset)
    } else {
      offset = writeInt32(message, Buffer.byteLength(v), offset)
      offset = writeString(message, v, offset)
    }
  }

  writeInt16(message, BindFormat.Binary, offset) // Result format

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
