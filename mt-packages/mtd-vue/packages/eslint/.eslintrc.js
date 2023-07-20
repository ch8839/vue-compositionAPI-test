// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    "parser": "@typescript-eslint/parser",
  },
  // required to lint *.vue files
  plugins: [
    "@typescript-eslint",
    "vue",
  ],
  env: {
    browser: true,
    mocha: true,
    node: true,
  },
  globals: {
    'expect': false,
    'should': false,
    'sinon': false,
    BASE_URL: false,
    PUBLIC_PATH: false,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    "@typescript-eslint/no-explicit-any": 0, // 🤡：期望是1
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/no-non-null-assertion": 0, // 🤡：期望是1
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-this-alias": "off",
    "semi": ["warn", "never"],
    // allow async-await
    "generator-star-spacing": "off",
    "prefer-promise-reject-errors": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "max-len": [2, 200, 2],
    "vue/max-attributes-per-line": "off",
    "vue/html-indent": "off",
    "vue/require-default-prop": "off",
    "vue/order-in-components": 2,
    "vue/this-in-template": [2, "never"],
    "prefer-const": 2,
    "comma-dangle": ["error", "always-multiline"],
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    "vue/html-closing-bracket-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/no-unused-vars": "off",
    "vue/no-template-shadow": "off",
    "vue/no-unused-components": "off",
    "vue/multi-word-component-names": "off",
    "template-curly-spacing": "off",
    "indent": [
      "warn",
      2,
      {
        "ignoredNodes": [
          "TemplateLiteral",
        ],
        "SwitchCase": 1,
      },
    ],
    "standard/no-callback-literal": "off",
  },
}
