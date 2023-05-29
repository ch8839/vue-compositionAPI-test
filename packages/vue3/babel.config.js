const JSX = require('@vue/babel-plugin-jsx')
const ENV = require('@babel/preset-env')
const RuntimePlugin = require('@babel/plugin-transform-runtime')

const config = {
  presets: [
    [
      ENV,
      {
        targets: {
          esmodules: false,
        },
        modules: 'auto'
      },
    ]
  ],
  plugins: [
    [RuntimePlugin, {
      useESModules: true,
    }],
    [JSX, {
      "transformOn": true,
      "enableObjectSlots": false,
    }]
  ],
  "env": {
    "esm": {
      "presets": [
        [
          ENV,
          {
            "modules": false, // 不进行 es6 模块编译，保持 es6 模块方式以支持 tree-shacking
          },
        ],
      ],
    },
  }
}
module.exports = config
