import {clone} from '../utils/clone'

interface GetOptions {
    cache?: boolean
}

const cache: {[url: string]: any} = {}

export function get<T = any>(url: string, options: GetOptions = {}): Promise<T> {
    if (options.cache && cache.hasOwnProperty(url)) {
        return Promise.resolve(clone(cache[url]))
    }

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            if (options.cache) {
                cache[url] = clone(json)
            }
            return json
        })
}
