'use strict'
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const TerserPlugin = require('terser-webpack-plugin')

const config = merge(baseWebpackConfig, {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    publicPath: '/',
    filename: 'index.js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    library: 'MTD',
    umdNamedDefine: true,
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    },
    '@vue/composition-api': {
      root: 'VueCompositionAPI',
      commonjs: '@vue/composition-api',
      commonjs2: '@vue/composition-api',
      amd: '@vue/composition-api',
    }
  },
  devtool: false,
  performance: {
    maxAssetSize: 6000000,
  },
  optimization: {
    minimize: true, // 🤡压缩开关
    minimizer: [
      new TerserPlugin({
        cache: false,
        parallel: true,
        sourceMap: false, // Must be set to true if using source-maps in production
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
  ],
})

console.log(config)
console.log('【打包】webpack的版本:', webpack.version)
module.exports = config
