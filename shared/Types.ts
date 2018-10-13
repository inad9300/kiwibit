export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
            ? ReadonlyArray<DeepPartial<U>>
            : DeepPartial<T[P]>
}

export type In<F extends Fn<any, any>> = Parameters<F>[0]
export type Out<F extends Fn<any, any>> = ReturnType<F>

export type Fn<I, O> = (i: I) => O
export type AsyncFn<I, O> = (i: I) => Promise<O>

export type Json = JsonPrimitive | JsonObject | JsonArray
export type JsonPrimitive = null | boolean | number | string
export type JsonObject = {[key: string]: Json}
export interface JsonArray extends Array<Json> {}
