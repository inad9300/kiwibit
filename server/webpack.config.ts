import { ConfigurationFactory, DefinePlugin, IgnorePlugin } from 'webpack'
import { resolve } from 'path'
import { ChildProcess, spawn } from 'child_process'
import { HookPlugin } from '../shared/HookPlugin'

let lastChild: ChildProcess | undefined

const config: ConfigurationFactory = (_env, args) => ({
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
    new DefinePlugin({ DEBUG: args.mode === 'development' }),
    new IgnorePlugin(/^pg-native$/),
    HookPlugin('done', () => {
      if (args.mode === 'development') {
        lastChild?.kill()
        lastChild = spawn('node', ['--inspect=9229', 'bin/main.js'], { stdio: 'inherit' })
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'bin')
  }
})

export default config
