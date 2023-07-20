module.exports = {
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
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    ["@vue/babel-plugin-jsx",{
      transformOn: true,
      enableObjectSlots: false,
    }]
  ]
}
