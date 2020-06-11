export function groupBy<T, K extends keyof T>(array: T[], key: K) {
  const result: { [key: string]: T[] } = {}
  for (const item of array) {
    const group = item[key] as unknown as string
    if (!result[group]) {
      result[group] = [item]
    } else {
      result[group].push(item)
    }
  }
  return result
}
