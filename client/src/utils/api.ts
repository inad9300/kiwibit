import type { Api } from '../../../server/src/Api'

export function api<Fn extends keyof Api>(
  fn: Fn,
  payload: Parameters<Api[Fn]>[0]
): ReturnType<Api[Fn]> {
  return fetch('http://localhost:4000/api/' + fn, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  })
  .then(res => res.text())
  .then(body => (body ? JSON.parse(body) : undefined)) as ReturnType<Api[Fn]>
}
