import { createServer, IncomingMessage, ServerResponse } from 'http'
import { readFile } from 'fs'
import { resolve } from 'path'
import { URL } from 'url'
import { log } from './log'
import * as api from './api'

process.on('uncaughtException', err => log.error('Uncaught exception.', err))
process.on('unhandledRejection', err => log.error('Unhandled rejection.', err))

const serverRoot = resolve(__dirname, '../..')

createServer(serve)
  .listen(process.env.PORT || 4000, () => log.info(`Server up and running.`))
  .on('error', err => log.error('Server failed to start.', err))

function serve(req: IncomingMessage, res: ServerResponse) {
  req.on('error', err => {
    log.error('Unexpected request error.', err)
    reply(res, new Error('Unexpected request error. ' + err.message))
  })

  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  if (req.method === 'OPTIONS') {
    return res.writeHead(200).end()
  } else if (req.method !== 'GET' && req.method !== 'POST') {
    return reply(res, new Error('Only GET and POST requests allowed.'))
  }

  log.debug('HTTP request.', req.method, req.url)

  if (req.method === 'GET') {
    let { pathname } = new URL('http://localhost' + req.url!)
    if (pathname === '/') {
      pathname = '/index.html'
    }
    return readFile(serverRoot + pathname, (err, data) => {
      if (err) {
        reply(res, new Error('File not found.'))
      } else {
        res.writeHead(200).end(data)
      }
    })
  }

  try {
    const fnName = req.url!.substr('/api/'.length) as keyof typeof api
    const fn = api[fnName] as ((payload: any) => Promise<any>) | undefined
    if (!fn) {
      reply(res, new Error(`Unknown API function: "${fnName}".`))
    } else {
      getPayload(req)
        .then(reqPayload => fn(reqPayload))
        .then(resPayload => reply(res, resPayload))
        .catch(err => reply(res, err))
    }
  } catch (err) {
    reply(res, err)
  }
}

function getPayload(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const body: Buffer[] = []
    req
      .on('error', err => reject(err))
      .on('data', chunk => body.push(chunk))
      .on('end', () => resolve(body.length > 0 ? JSON.parse(Buffer.concat(body).toString()) : ''))
  })
}

function reply(res: ServerResponse, payload: any | Error) {
  log.debug('HTTP response.', payload)
  res
    .writeHead(payload instanceof Error ? 500 : 200, { 'Content-Type': 'application/json; charset=utf-8' })
    .end(JSON.stringify(payload instanceof Error ? { error: payload.message } : payload))
}
