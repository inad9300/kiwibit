import type * as apiIndex from '../../../server/src/api'

type Api = typeof apiIndex

type ThenArg<T> = T extends PromiseLike<infer U> ? U : never

export type ApiInput<Fn extends keyof Api> = Parameters<Api[Fn]>[0]

export type ApiOutput<Fn extends keyof Api> = ThenArg<ReturnType<Api[Fn]>>

export type AbortablePromise<T> = Promise<T> & {
  abort(): void
}

export function api<Fn extends keyof Api>(fn: Fn, payload: ApiInput<Fn>) {
  const aborter = new AbortController()

  const promise = fetch((DEBUG ? 'http://localhost:4000' : '') + '/api/' + fn, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: aborter.signal
  })
  .then(res => res.text())
  .then(body => (body ? JSON.parse(body) : undefined)) as ReturnType<Api[Fn]>

  return Object.assign(promise, {
    abort: aborter.abort.bind(aborter)
  })
}
