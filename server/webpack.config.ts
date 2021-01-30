import { Configuration, DefinePlugin, IgnorePlugin } from 'webpack'
import { ChildProcess, spawn } from 'child_process'
import { resolve } from 'path'

let lastChild: ChildProcess | undefined

const config: Configuration = {
  entry: './src/main.ts',
  target: 'node',
  node: false,
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      include: [
        resolve(__dirname, 'src'),
        resolve(__dirname, '../shared')
      ]
    }]
  },
  plugins: [
    function () {
      new DefinePlugin({ DEBUG: this.options.mode === 'development' }).apply(this)
      new IgnorePlugin({ resourceRegExp: /^pg-native$/ }).apply(this)

      this.hooks.done.tap('hooks::done', () => {
        if (this.options.mode === 'development') {
          lastChild?.kill()
          lastChild = spawn('node', ['--inspect=9229', 'bin/main.js'], { stdio: 'inherit' })
        }
      })
    }
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'bin')
  }
}

export default config
