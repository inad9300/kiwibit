import { filesEndingWith } from './filesEndingWith'
import { TestSuite, runTestSuites } from './test-utils'

const srcDir = process.cwd() + '/src'
const testExt = '.test.ts'

const testSuites = filesEndingWith(srcDir, testExt).map(file => {
  const suite = require(file).default as TestSuite
  if (
    !suite ||
    typeof suite !== 'object' ||
    Object.keys(suite).length === 0 ||
    Object.values(suite).some(p => typeof p !== 'function')
  ) {
    console.error(
      'Test files are expected to default-export non-empty objects from test names (strings)'
        + ' to possibly-asynchronous functions. Given:',
      suite
    )
    process.exit(-1)
  }

  return [
    file.slice(srcDir.length + 1, -testExt.length),
    suite
  ] as const
})

const passed = runTestSuites(testSuites)

console.info('\n Coverage 📔')

process.exit(passed ? 0 : 1)
