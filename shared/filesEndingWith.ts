import { join } from 'path'
import { readdirSync, statSync } from 'fs'

export function filesEndingWith(dir: string, end: string, result: string[] = []) {
  const paths = readdirSync(dir).map(f => join(dir, f))
  for (const p of paths) {
    if (statSync(p).isDirectory()) {
      filesEndingWith(p, end, result)
    } else if (p.endsWith(end)) {
      result.push(p)
    }
  }
  return result
}
