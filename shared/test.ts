import { TestSuite, runTestSuites } from './test-utils'

const testSuites: [string, TestSuite][] = []

export function test(suite: TestSuite) {
  if (DEBUG) {
    const file = new Error().stack!
      .split('\n')
      .filter((_line, idx, arr) => arr[idx - 1]?.includes('Object.test'))
      .pop()!

    testSuites.push([
      file.slice(file.indexOf('/src') + 4, file.indexOf('.ts')),
      suite
    ])
  }
}

if (DEBUG) {
  setTimeout(() => runTestSuites(testSuites), 0)
}
