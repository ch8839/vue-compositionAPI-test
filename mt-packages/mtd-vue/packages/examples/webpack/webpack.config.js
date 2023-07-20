const path = require('path')
const webpackConfig = require("@ss/mtd-adapter/webpack/webpack.config")
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ComponentsAlias = require('@ss/mtd-vue2/alias.js')
const webpack = require('webpack')

console.log('【跑demo】webpack的版本:', webpack.version)

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const isProd = process.env.NODE_ENV === 'production'


const mtdPath = isProd ? 'mtd-vue2/' : ''

const PublicPath = process.env.PUBLIC_PATH
  ? process.env.PUBLIC_PATH.charAt(process.env.PUBLIC_PATH.length - 1) === '/'
    ? process.env.PUBLIC_PATH
    : process.env.PUBLIC_PATH + '/'
  : ''

const publicPath = PublicPath + mtdPath || '/'

module.exports = merge(webpackConfig, {
  entry: {
    docs: resolve('src/index.ts'),
  },
  output: {
    path: resolve('dist/mtd-vue2'),
    filename: '[name].[chunkhash].js',
    publicPath: publicPath,
    // globalObject: 'this',
  },
  resolve: {
    "alias": {
      ...ComponentsAlias,
      '@ss/mtd-adapter': '@ss/mtd-adapter-vue2',
    },
  },
  devtool: "eval",
  devServer: {
    port: 8085,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      PUBLIC_PATH: `'${isProd ? '/mtd-vue2/' : '/mtd-vue2/' }'`,
    }),
    new HtmlWebpackPlugin({
      template: resolve('src/index.html'),
      inject: true,
      minify: {
        collapseWhitespace: true,
      },
    }),
  ],
})
