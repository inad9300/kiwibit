import * as http from 'http'
import './Error'
import {log} from './log'
import {config} from '../../shared/config'
import {Api, ApiFn, ApiPayload} from './Api'
import * as api from './api'

process.on('uncaughtException', err => log.error('Uncaught exception.', err))
process.on('unhandledRejection', err => log.error('Unhandled rejection.', err))

http
    .createServer(serve)
    .listen(config.server.port, () => log.info(`Server up and running on port ${config.server.port}.`))
    .on('error', err => log.error('Server failed to start.', err))

function serve(req: http.IncomingMessage, res: http.ServerResponse) {
    req.on('error', err => {
        log.error('Unexpected request error.', err)
        reply(res, new Error('Unexpected request error. ' + err.message))
    })

    res.setHeader('Access-Control-Allow-Origin', config.client.addr.slice(0, -1))
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.writeHead(200)
        return res.end()
    } else if (req.method !== 'POST') {
        return reply(res, new Error('Only POST requests are allowed.'))
    }

    log.debug('HTTP request.', req.url)

    try {
        const fnName = req.url!.substr(5) as keyof Api // Skip "/api/".
        const fn = api[fnName] as unknown as ApiFn<ApiPayload, ApiPayload>
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

function getPayload(req: http.IncomingMessage): Promise<ApiPayload> {
    return new Promise((resolve, reject) => {
        const body: Buffer[] = []
        req
            .on('error', err => reject(err))
            .on('data', chunk => body.push(chunk))
            .on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())))
    })
}

const headers = {'Content-Type': 'application/json; charset=utf-8'}

function reply(res: http.ServerResponse, payload: ApiPayload | Error) {
    log.debug('HTTP response.', payload)
    res.writeHead(payload instanceof Error ? 500 : 200, headers)
    res.end(JSON.stringify(payload))
}
