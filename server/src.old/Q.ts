declare global {
    interface Promise<T> {
        finally: (onFinally?: () => void) => Promise<any>
    }
}

export const ok: PromiseConstructor['resolve'] = Promise.resolve.bind(Promise)

export const all: PromiseConstructor['all'] = Promise.all.bind(Promise) as any

export const nil: () => Promise<undefined> = Promise.resolve.bind(Promise, undefined) as any

type HttpErrorCode = 400 | 401 | 404 | 500

export class HttpError extends Error {
    constructor(public code: HttpErrorCode, msg?: string) {
        super(msg)
        Object.setPrototypeOf(this, HttpError.prototype)
    }
}

export function err(code: HttpErrorCode, msg?: string) {
    return Promise.reject(new HttpError(code, msg))
}
