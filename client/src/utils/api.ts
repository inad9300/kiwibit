import type { Api } from '../../../server/src/Api'

export type ApiInput<Fn extends keyof Api> = Parameters<Api[Fn]>[0]

export type ApiOutput<Fn extends keyof Api> = ReturnType<Api[Fn]>

export function api<Fn extends keyof Api>(fn: Fn, payload: ApiInput<Fn>) {
  const aborter = new AbortController()

  const promise = fetch((DEBUG ? 'http://localhost:4000' : '') + '/api/' + fn, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: aborter.signal
  })
  .then(res => res.text())
  .then(body => (body ? JSON.parse(body) : undefined)) as ApiOutput<Fn>

  return Object.assign(promise, {
    abort: aborter.abort.bind(aborter)
  })
}
