const path = require('path')
const webpackConfig = require("@ss/mtd-adapter-vue3/webpack/webpack.config")
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ComponentsAlias = require('@ss/mtd-vue-next-temp/alias.js')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const isProd = process.env.NODE_ENV === 'production'

const PublicPath = process.env.PUBLIC_PATH
  ? process.env.PUBLIC_PATH.charAt(process.env.PUBLIC_PATH.length - 1) === '/'
    ? process.env.PUBLIC_PATH
    : process.env.PUBLIC_PATH + '/'
  : ''

const publicPath = PublicPath || '/'

module.exports = merge(webpackConfig, {
  entry: {
    docs: resolve('src/index.ts'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].[chunkhash].js',
    publicPath: publicPath,
    // globalObject: 'this',
  },
  resolve: {
    "alias": {
      ...ComponentsAlias,
      '@ss/mtd-adapter': '@ss/mtd-adapter-vue3',
    },
    modules: [
      resolve('./node_modules'),
    ],
  },
  resolveLoader: {
    modules: [
      resolve('node_modules'),
      'node_modules',
    ],
  },
  devtool: false,
  devServer: {
    port: 8086,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      PUBLIC_PATH: `'${isProd ? '/mtd-vue-next/' : '/mtd-vue-next/' }'`,
      __VUE_PROD_DEVTOOLS__: true,
      __VUE_OPTIONS_API__: true,
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
