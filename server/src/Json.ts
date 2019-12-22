type Json = JsonPrimitive | JsonObject | JsonArray

type JsonPrimitive = null | boolean | number | string

export interface JsonObject {
  [key: string]: Json
}

export interface JsonArray extends Array<Json> {}
