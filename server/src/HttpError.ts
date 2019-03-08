type HttpErrorCode = 404 | 405 | 500

export class HttpError extends Error {
    constructor(public code: HttpErrorCode, message: string) {
        super(message)
        Object.setPrototypeOf(this, HttpError.prototype)
    }
}
