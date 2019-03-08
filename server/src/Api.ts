import {JsonArray, JsonObject} from './Json'
import {getCurrentUser} from './api/getCurrentUser'
import {registerUser} from './api/registerUser'

export type ApiPayload = void | JsonArray | JsonObject

export interface ApiFn<I extends ApiPayload, O extends ApiPayload> {
    (payload: I): Promise<O>
}

interface BaseApi {
    [fn: string]: ApiFn<any, any>
}

export interface Api extends BaseApi {
    getCurrentUser: typeof getCurrentUser
    registerUser: typeof registerUser
}
