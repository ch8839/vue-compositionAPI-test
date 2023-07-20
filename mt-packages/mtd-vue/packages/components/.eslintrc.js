// https://eslint.org/docs/user-guide/configuring
const config = require("@ss/mtd-vue-eslint")

module.exports = {...config,...{
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    "parser":"@typescript-eslint/parser",
  },
}}
