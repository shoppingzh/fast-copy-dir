/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    '@shoppingzh', //
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-promise-executor-return': [0],
    'linebreak-style': [0],
  },
}
