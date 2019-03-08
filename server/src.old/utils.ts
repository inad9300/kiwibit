// type Serial<T> = {
//     [P in keyof T]: T[P] extends Primitive ? T[P] : string
// }

// export function isNumeric(str: string): boolean {
//     return /^[0-9]*$/.test(str)
// }

// export const b64 = {
//     encode: (str: string): string => Buffer.from(str, 'utf8').toString('base64'),
//     decode: (str: string): string => Buffer.from(str, 'base64').toString('utf8'),
// }

// export function validDate(str: string): Promise<Date>
// export function validDate(str: undefined): Promise<undefined>
// export function validDate(str: string | undefined): Promise<Date | undefined>
// export function validDate(str: string | undefined): Promise<Date | undefined> {
//     if (str === undefined) {
//         return Q.nil()
//     }
//     const date = new Date(str)
//     if (isNaN(date.getTime())) {
//         return Q.err(400, `Invalid date: "${str}".`)
//     }
//     return Q.ok(date)
// }

// export const random = {
//     ascii: (size = 8) => {
//         let str = Math.random().toString(36).substr(2)
//         while (str.length < size) {
//             str += Math.random().toString(36).substr(2)
//         }
//         return str.substr(0, size)
//     }
// }
