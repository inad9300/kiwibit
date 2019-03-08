export let __: never // Force the file to be a module, thus allowing global declarations.

declare global {
    interface Error {
        toJSON(): {error: string}
    }
}

Error.prototype.toJSON = function () {
    return {error: this.message}
}
