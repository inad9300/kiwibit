/**
 * Shape of the "things" that are safely convertible to JSON and safely
 * parseable as JSON.
 **/
type Json = JsonPrimitive | JsonObject | JsonArray

type JsonPrimitive = undefined | null | boolean | number | string | {toJSON(): string}

export interface JsonObject {
    [key: string]: Json
}

export interface JsonArray extends Array<Json> {}
