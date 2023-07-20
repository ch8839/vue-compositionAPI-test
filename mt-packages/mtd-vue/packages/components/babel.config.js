const babelConfig = require('@ss/mtd-adapter/babel.config')
const pkgName = "@ss/mtd-vue2"
const adapterVuePKG = require('./config').adapterVuePKG

const config = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          esmodules: false,
        },
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
    ['@vue/babel-preset-jsx',
      {
        compositionAPI: true,
      }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime',{
      useESModules: true,
    }],
  ],
  "env": {
    ...babelConfig.env,
    "esm": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "modules": false, // 不进行 es6 模块编译，保持 es6 模块方式以支持 tree-shacking
          },
        ],
      ],
      "plugins": [
        ["module-resolver", {
          "root": [pkgName],
          "alias": {
            "@components": `${pkgName}/es`,
            "@utils": `${pkgName}/es/__utils__`,
            "@tests": `${pkgName}/es/__tests__`,
            "@hooks": `${pkgName}/es/hooks`,
            "@ss/mtd-adapter": adapterVuePKG,
          },
        }],['@babel/plugin-transform-runtime',{
          "useESModules": true,
        }],
      ],
    },
    "test": {
      presets: [
        [
          '@babel/env',
        ],
        [
          '@babel/preset-typescript',
          {
            allExtensions: true,
            isTSX: true,
          },
        ],
        '@vue/babel-preset-jsx',
      ],
    },
  },
}
module.exports = config
