type Logable = void | null | undefined | Object

export const log = {
    debug: (msg: Object, ...moreInfo: Logable[]): void => {
        if (global.$debug) {
            console.debug(new Date().toISOString(), '[DEBUG]', msg, ...moreInfo)
        }
    },
    info: (msg: Object, ...moreInfo: Logable[]): void => {
        console.info(new Date().toISOString(), '[INFO]', msg, ...moreInfo)
    },
    warn: (msg: Object, ...moreInfo: Logable[]): void => {
        console.warn(new Date().toISOString(), '[WARNING]', msg, ...moreInfo)
    },
    error: (msg: Object, ...moreInfo: Logable[]): void => {
        console.error(new Date().toISOString(), '[ERROR]', msg, ...moreInfo)
    }
}
