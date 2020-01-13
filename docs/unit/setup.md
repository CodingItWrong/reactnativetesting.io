---
title: Setting Up Jest
---

# Setting Up Jest

React Native CLI installs the [Jest][jest] testing framework by default, but if you're using [Expo][expo] we need to install it manually.

## Installing Jest

There is an Expo-specific Jest package we can use:

```bash
$ yarn add --dev jest-expo
```

Add the following to `package.json`:

```diff
     "android": "expo start --android",
     "ios": "expo start --ios",
+    "test": "jest",
     "eject": "expo eject"
   },
...
     "jest-expo": "^31.0.0"
   },
+  "jest": {
+    "preset": "jest-expo"
+  },
   "private": true
```

With this, our setup should be done.

## Smoke Test

To confirm Jest is working, create a `__tests__` folder, then create a `__tests__/smoke.spec.js` file. Add the following contents:

```javascript
describe('truth', () => {
  it('is true', () => {
    expect(true).toEqual(true);
  });
});
```

Run the tests with `yarn test`. You should see output like the following:

```bash
# yarn test
yarn run v1.13.0
$ jest
 PASS  __tests__/smoke.spec.js
  truth
    ✓ is true (3ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.662s
Ran all test suites matching /__tests__\/smoke.spec.js/i.
✨  Done in 9.35s.
```

## Configuring ESLint

Jest has a number of globally-available functions, so if you're using [ESLint][eslint], it will complain about these. We need to configure ESLint to accept them.

If you aren't already using ESLint in your project, it's easy to install in a React Native project. Add the following packages:

```sh
yarn add --dev eslint \
               babel-eslint \
               eslint-config-codingitwrong \
               eslint-plugin-import \
               eslint-plugin-jest \
               eslint-plugin-jsx-a11y \
               eslint-plugin-react
```

Then create an `.eslintrc.js` file at the root of your project and add the following:

```js
module.exports = {
  extends: [
    'plugin:react/recommended',
    'codingitwrong',
  ],
  settings: {
    react: {
      version: '16.5',
    },
  },
  parser: 'babel-eslint',
  plugins: [
    'jest',
  ],
  env: {
    'browser': true,
    'es6': true,
    'jest/globals': true,
    'node': true,
  },
  rules: {
    'react/prop-types': 'off',
  }
};
```

Most code editors can be configured to run ESLint rules as you edit. You can also add an NPM script to do so:

```diff
   "scripts": {
     "start": "node node_modules/react-native/local-cli/cli.js start",
+    "lint": "eslint \"**/*.js\"",
     "test": "jest"
   },
```

[eslint]: https://eslint.org/
[expo]: https://expo.io/
[jest]: https://jestjs.io/
