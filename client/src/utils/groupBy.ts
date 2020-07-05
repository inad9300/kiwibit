export function groupBy<T>(array: T[], key: keyof T) {
  const result: Record<string, T[]> = {}
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
