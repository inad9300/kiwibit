import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { Configuration, DefinePlugin } from 'webpack'
import { ChildProcess, spawn } from 'child_process'

const pgeonDir = './node_modules/pgeon'
const pgeonCopyDir = './dist/pgeon'

if (!existsSync(pgeonCopyDir))
  mkdirSync(pgeonCopyDir)

for (const file of readdirSync(pgeonDir))
  copyFileSync(`${pgeonDir}/${file}`, `${pgeonCopyDir}/${file}`)

let lastChild: ChildProcess | undefined

const config: Configuration = {
  entry: './src/main.ts',
  target: 'node',
  node: false,
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: [
        { loader: 'ts-loader', options: { allowTsInNodeModules: true } },
        `${pgeonCopyDir}/webpack-loader.ts`
      ]
    }]
  },
  plugins: [
    function () {
      new DefinePlugin({ DEBUG: this.options.mode === 'development' }).apply(this)

      this.hooks.done.tap('hooks::done', stats => {
        if (this.options.mode === 'development') {
          lastChild?.kill()

          if (!stats.hasErrors())
            lastChild = spawn('node', ['--inspect=9229', 'dist/main.js'], { stdio: 'inherit' })
        }
      })
    }
  ]
}

export default config
