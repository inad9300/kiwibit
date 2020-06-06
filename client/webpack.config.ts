import { ConfigurationFactory, DefinePlugin } from 'webpack'
import { resolve } from 'path'

const config: ConfigurationFactory = (_env, args) => ({
  entry: './src/main.ts',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      include: resolve(__dirname, 'src')
    }]
  },
  plugins: [
    new DefinePlugin({ DEBUG: args.mode === 'development' })
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
