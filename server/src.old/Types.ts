export type Primitive = boolean | number | string | symbol | null | undefined | void

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Mandatory<T> = Exclude<T, void> // `Required` for primitives.

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
            ? ReadonlyArray<DeepPartial<U>>
            : DeepPartial<T[P]>
}

export type Fn<I, O> = (i: I) => O
export type AsyncFn<I, O> = (i: I) => Promise<O>
export type Ctor<T = any> = new (...args: any[]) => T

export type In<F extends Fn<any, any>> = Parameters<F>[0]
export type Out<F extends Fn<any, any>> = ReturnType<F>
