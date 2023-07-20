const path = require('path')
const config = require('../config')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const adapterVuePKG = config.adapterVuePKG


function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
const { pkgName, fullName, isProd } = config

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: false,
  entry: {
    docs: resolve('examples/index.ts'),
  },
  output: {
    path: resolve('lib'),
    filename: '[name].js',
    publicPath: '/',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.tsx', '.json'],
    alias: {
      // 'vue': '@vue/runtime-dom',
      '@': resolve('src'),
      components: resolve('src'),
      '@components': resolve('src'),
      '@utils': resolve('src/__utils__'),
      '@hooks': resolve('src/hooks'),
      [fullName]: resolve(''),
      [pkgName]: resolve(''),

      '@ss/mtd-adapter': adapterVuePKG, // ⭕️转换vue2/3
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader', '@bfe/vue-source-doc-loader'],
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: ['babel-loader?cacheDirectory=true'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              esModule: false,
              name: 'img/[name].[hash:7].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              esModule: false,
              name: 'fonts/[name].[hash:7].[ext]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: resolve('.postcssrc.js'),
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !isProd },
          },
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader', 
      },
    ],
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    },
    '@vue/composition-api': '@vue/composition-api',
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    port: config.port,
    open: false,
    publicPath: '/',
  },
}
