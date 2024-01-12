module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'standard'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': 'off', // Allowing console.log for development purposes
    'node/no-unsupported-features/es-syntax': 'off', // Allowing ES modules in Node.js
    'import/extensions': 'off', // Avoiding file extension restrictions
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'promise/param-names': 'off', // Allow using any variable names for Promise parameters
    'promise/always-return': 'off' // Allow not always returning a Promise
  }
}
