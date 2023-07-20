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
    ['@vue/babel-preset-jsx',
    {
      compositionAPI: true,
    }],
  ],
}
