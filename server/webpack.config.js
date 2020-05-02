const { resolve } = require('path')
const { IgnorePlugin } = require('webpack')

module.exports = {
  target: 'node',
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new IgnorePlugin(/^pg-native$/)
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'bin')
  }
}
