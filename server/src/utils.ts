import * as http from 'http'
import {Api} from '../../shared/Api'
import {In, Out, AsyncFn} from '../../shared/Types'
import * as Q from './Q'

declare global {
    interface Error {
        toJSON?(): {msg: string}
    }
}

Error.prototype.toJSON = function () {
    return {msg: this.message}
}

type MetadataKeys = '$token'

type OmitMetadata<T> = Pick<T, Exclude<keyof T, MetadataKeys>>

type Serial<T> = {
    [P in keyof T]: T[P] extends Date ? string : T[P]
}

export type ServerApi = {
    [F in keyof Api]: AsyncFn<
        Serial<OmitMetadata<In<Api[F]>>>,
        Out<Api[F]>
    >
}

export function handle(req: http.IncomingMessage, handlers: ServerApi): Promise<any> {
    const fn = req.url!.substr(5) as keyof ServerApi // Skip "/api/".
    const handler = handlers[fn]
    if (!handler) {
        return Q.err(404, `Unknown API method: "${fn}".`)
    }
    return getBody(req).then(body => (handler as any)(body))
}

function getBody(req: http.IncomingMessage): Promise<any> {
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

export function write(res: http.ServerResponse, statusCode: number, body: any) {
    console.debug('HTTP response', statusCode, body)
    res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8'})
    res.end(JSON.stringify(body))
}

export function isNumeric(str: string): boolean {
    return /^[0-9]*$/.test(str)
}

export function parseInt(str: string): number {
    return global.parseInt(str, 10)
}

export const b64 = {
    encode: (str: string): string => Buffer.from(str, 'utf8').toString('base64'),
    decode: (str: string): string => Buffer.from(str, 'base64').toString('utf8')
}

export function validDate(str: string): Promise<Date>
export function validDate(str: undefined): Promise<undefined>
export function validDate(str: string | undefined): Promise<Date | undefined>
export function validDate(str: string | undefined): Promise<Date | undefined> {
    if (str === undefined) {
        return Q.nil()
    }
    const date = new Date(str)
    if (isNaN(date.getTime())) {
        return Q.err(400, `Invalid date: "${str}".`)
    }
    return Q.ok(date)
}
