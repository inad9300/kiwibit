import {Constructor} from './Constructor'
import {WrapperType} from './WrapperType'

export type Column = null | boolean | number | string | Date | Uint8Array

export type Row = {
    [column: string]: Column
}

/**
 * Represents the type of objects holding runtime type information equivalent to
 * the given record type.
 *
 * TODO Create corresponding TypeScript transformer.
 */
export type RowMetadata<R extends Row> = {
    [P in keyof R]-?: {
        type: Constructor<WrapperType<Exclude<R[P], null>>>,
        optional: null extends R[P] ? true : false
    }
}
