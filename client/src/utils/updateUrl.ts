import { Page } from '../pages'

export function updateUrl(page: Page, record: Record<string, string | number | undefined | null>) {
  const url = Object
    .keys(record)
    .filter(key => record[key])
    .map(key => `${key}=${record[key]}`)
    .join('&')

  history.pushState(null, '', `/?page=${page}` + (url ? '&' + url : ''))
}
