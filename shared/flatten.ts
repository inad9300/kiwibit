export function flatten<T>(matrix: T[][]): T[] {
  return ([] as T[]).concat(...matrix)
}
