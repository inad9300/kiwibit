export interface Constructor<T> {
  new (value?: any): T
}

export type WrapperType<T> = T extends boolean
  ? Boolean
  : T extends number
  ? Number
  : T extends string
  ? String
  : T

type Json = JsonPrimitive | JsonObject | JsonArray

type JsonPrimitive = null | boolean | number | string

export interface JsonObject {
  [key: string]: Json
}

export interface JsonArray extends Array<Json> {}
