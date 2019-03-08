import * as http from 'http'

import './$debug'
import './Error'
import {log} from './log'
import {Api, ApiPayload} from './Api'
import {HttpError} from './HttpError'
import {getCurrentUser} from './api/getCurrentUser'
import {registerUser} from './api/registerUser'

const clientAddr = 'http://localhost:1234'
const serverPort = 4000

process.on('uncaughtException', err => log.error('Uncaught exception.', err))

http
    .createServer(serve)
    .listen(serverPort, () => log.info(`Server up and running on port ${serverPort}.`))
    .on('error', err => log.error('Server failed to start.', err))

const api: Api = {
    getCurrentUser,
    registerUser
}

function serve(req: http.IncomingMessage, res: http.ServerResponse) {
    req.on('error', err => {
        log.error('Unexpected request error.', err)
        reply(res, new HttpError(500, 'Unexpected request error. ' + err.message))
    })

    res.setHeader('Access-Control-Allow-Origin', clientAddr)
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(200)
        return res.end()
    } else if (req.method !== 'POST') {
        return reply(res, new HttpError(405, 'Only POST requests are allowed.'))
    }

    log.debug('HTTP request.', req.url)

    try {
        const fnName = req.url!.substr(5) as keyof Api // Skip "/api/".
        const fn = api[fnName]
        if (!fn) {
            reply(res, new HttpError(404, `Unknown API function: "${fnName}".`))
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

function getPayload(req: http.IncomingMessage): Promise<ApiPayload> {
    return new Promise((resolve, reject) => {
        const body: Buffer[] = []
        req
            .on('error', err => reject(err))
            .on('data', chunk => body.push(chunk))
            .on('end', () => {
                if (body.length === 0) {
                    resolve(undefined)
                } else {
                    resolve(JSON.parse(Buffer.concat(body).toString()))
                }
            })
    })
}

function reply(res: http.ServerResponse, payload: ApiPayload | HttpError) {
    const statusCode = payload instanceof HttpError ? payload.code : 200
    log.debug('HTTP response.', payload)
    res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8'})
    res.end(JSON.stringify(payload))
}
