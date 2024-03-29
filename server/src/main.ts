import { createServer, IncomingMessage, ServerResponse } from 'http'
import { readFile } from 'fs'
import { resolve } from 'path'
import { URL } from 'url'
import { log } from './log'
import * as apiIndex from './api'

process.on('uncaughtException', err => log.error('Uncaught exception.', err))
process.on('unhandledRejection', err => log.error('Unhandled rejection.', err))

const port = process.env.PORT || 4000
const serverRoot = resolve(__dirname, '../..')

createServer(serve)
  .listen(port, () => log.info(`Server up and running on port ${port}.`))
  .on('error', err => log.error('Server failed to start.', err))

function serve(req: IncomingMessage, res: ServerResponse) {
  req.on('error', err => {
    log.error('Unexpected request error.', err)
    reply(res, new Error('Unexpected request error. ' + err.message))
  })

  if (req.method === 'GET') {
    log.info('GET', req.url)
    let { pathname } = new URL('http://localhost' + req.url!)
    if (pathname === '/') {
      pathname = '/index.html'
    }
    readFile(serverRoot + pathname, (err, data) => {
      if (err) {
        reply(res, new Error('File not found.'))
      } else {
        res.writeHead(200).end(data)
      }
    })
  }
  else if (req.method === 'POST') {
    try {
      const fnName = req.url!.substr('/api/'.length) as keyof typeof apiIndex
      const fn = apiIndex[fnName] as ((payload: any) => Promise<any>) | undefined
      if (!fn) {
        reply(res, new Error(`Unknown API function: "${fnName}".`))
      } else {
        const reqPayloadChunks: Buffer[] = []
        req
          .on('data', chunk => reqPayloadChunks.push(chunk))
          .on('end', () => {
            const reqPayload = reqPayloadChunks.length > 0
              ? JSON.parse(Buffer.concat(reqPayloadChunks).toString())
              : undefined
            log.info('POST', req.url, reqPayload)
            fn(reqPayload)
              .then(resPayload => reply(res, resPayload))
              .catch(err => reply(res, err))
          })
      }
    } catch (err) {
      reply(res, err)
    }
  }
  else {
    reply(res, new Error(`Only GET and POST methods allowed. Request was: ${req.method} ${req.url}`))
  }
}

function reply(res: ServerResponse, payload: unknown | Error) {
  const isError = payload instanceof Error
  if (isError) {
    log.warn('Error returned from API.', payload as Error)
  }
  res
    .writeHead(isError ? 500 : 200, { 'Content-Type': 'application/json; charset=utf-8' })
    .end(JSON.stringify(isError ? { error: (payload as Error).message } : payload))
}
