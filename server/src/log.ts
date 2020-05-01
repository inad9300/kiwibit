type Logable = void | null | undefined | Object

const now = () => new Date().toISOString()

export const log = {
  debug: (msg: Object, ...moreInfo: Logable[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(now(), '[DEBUG]', msg, ...moreInfo)
    }
  },
  info: (msg: Object, ...moreInfo: Logable[]) => {
    console.info(now(), '[INFO]', msg, ...moreInfo)
  },
  warn: (msg: Object, ...moreInfo: Logable[]) => {
    console.warn(now(), '[WARNING]', msg, ...moreInfo)
  },
  error: (msg: Object, ...moreInfo: Logable[]) => {
    console.error(now(), '[ERROR]', msg, ...moreInfo)
  }
}
