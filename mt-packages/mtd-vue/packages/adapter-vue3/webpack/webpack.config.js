const config = require('../config')
const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const markdownLoader = require('./markdown-loader')
// const adatporConfig = reuqire('@ss/mtd-adapter-vue2/compiler')
const babelConfig = require('../babel.config')

const { isProd, isVue2, isVue3 } = config
const root = process.cwd()
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function resolveContext (dir) {
  return path.join(root, dir)
}

const postCSSLoader = [{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        autoprefixer(),
        cssnano({ preset: 'default' }),
      ],
      sourceMap: true,
    },
  }
}]
const cssLoader = [
  isProd ? MiniCssExtractPlugin.loader : 'style-loader',
  {
  loader: 'css-loader',
  options: {
    sourceMap: false
  }
}, ...postCSSLoader]
const sassLoader = [
  ...cssLoader,
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  },
]

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: false,
  context: resolveContext(''),
  stats: 'normal', // 'errors-warnings',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.json'],
    alias: {
      '@': resolveContext('src'),
      '@vue/composition-api': 'vue'
    },
    modules: [
      resolve('./node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      resolve('node_modules'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use:[{
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              whitespace: 'condense',
              preserveWhitespace: false,
            },
          }
        }, '@bfe/vue-source-doc-loader']
      },
      {
        test: /\.(ts|tsx|jsx)$/,
        use: [{
          loader: 'babel-loader',
          options: babelConfig,
        }],
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: babelConfig,
        }],
        include: [
          resolveContext('src'),
          /@ss\/mtd-vue-next/
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'imgs/[name].[hash][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 20 * 1024 // 20kb
          }
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
      },
      {
        test: /\.scss$/,
        use: sassLoader,
      },
      {
        test: /\.css$/,
        use: cssLoader,
      },
      {
        test: /\.md$/,
        use: markdownLoader,
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        components: {
          // test: /(\/src\/|\/components\/)[^demo]*\.(js|vue)$/,
          test (module) {
            const reg = /(\/components\/src\/).*\.(js|ts|jsx|tsx|vue)/
            let r = reg.test(module.resource);
            if (!r) { return false }
            return !/(doc|demo|\.json)/.test(module.resource);
          },
          name: 'mtd-vue',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProd ? '"production"' : '"development"',
        DEPLOY_ENV: `"${process.env.DEPLOY_ENV}"` || '"development"',
        isVue2: isVue2 ? 'true' : 'false',
        isVue3: isVue3 ? 'true' : 'false',
      }
    }),
    new ESLintPlugin({
      extensions: ['.ts', 'tsx', '.js', '.jsx'],
      files: [
        "../components/",
        "./src"
      ]
    })
  ],
}

if (isProd) {
  webpackConfig.plugins.push(new MiniCssExtractPlugin({
    filename: isProd ? '[name].[chunkhash].css' : '[name].css',
    chunkFilename: isProd ? '[id].[chunkhash].css' : '[id].css',
    ignoreOrder: false, // Enable to remove warnings about conflicting order
  }))
}
module.exports = webpackConfig
