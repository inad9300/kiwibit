const { resolve } = require('path')
const { DefinePlugin } = require('webpack')

module.exports = {
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
    new DefinePlugin({
      DEBUG: process.env.NODE_ENV === 'development'
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'bin')
  }
}
