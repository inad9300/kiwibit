import { Configuration, DefinePlugin } from 'webpack'
// import { resolve } from 'path'

const config: Configuration = {
  entry: './src/main.ts',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      // include: resolve(__dirname, 'src')
    }]
  },
  plugins: [
    function () {
      new DefinePlugin({ DEBUG: this.options.mode === 'development' }).apply(this)
    }
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
}

export default config
