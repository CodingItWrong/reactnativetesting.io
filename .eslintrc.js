module.exports = {
  extends: ['plugin:react/recommended', 'prettier'],
  plugins: ['prettier', 'import'],
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/order': ['warn', {alphabetize: {order: 'asc'}}], // group and then alphabetize lines - https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    'no-duplicate-imports': 'error',
    'prettier/prettier': 'warn',
    quotes: ['error', 'single', {avoidEscape: true}], // single quote unless using interpolation
    'react/prop-types': 'off',
    'sort-imports': [
      'warn',
      {ignoreDeclarationSort: true, ignoreMemberSort: false},
    ], // alphabetize named imports - https://eslint.org/docs/rules/sort-imports
  },
};
