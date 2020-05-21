import { JsonObject, JsonArray } from './types'
import * as api from './api'

export type Api = typeof api

export interface ApiFn<I extends ApiPayload, O extends ApiPayload> {
  (payload: I): Promise<O>
}

export type ApiPayload = JsonObject | JsonArray