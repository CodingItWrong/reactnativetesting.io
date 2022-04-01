---
title: Setting Up Jest
---

# Setting Up Jest

React Native CLI installs the [Jest][jest] testing framework by default, but if you're using [Expo][expo] or have an older project created by React Native CLI before Jest was added, you'll need to install it manually.

## Expo: Installing Jest

Install the Jest package, as well as an Expo-specific Jest preset package:

```bash
$ expo install jest-expo jest
```

Add the following to `package.json`:

```diff
     "ios": "expo start --ios",
     "web": "expo start --web",
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

To confirm Jest is working, we'll create a smoke test.

First, if a `__tests__` folder exists, delete it--instead, we'll store our tests alongside our components.

Next, create a `smoke.spec.js` file at the root of the project. Add the following contents:

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
 PASS  ./smoke.spec.js
  truth
    ✓ is true (3ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.662s
Ran all test suites.
✨  Done in 2.09s.
```

## Configuring ESLint

Jest has a number of globally-available functions, so if you're using [ESLint][eslint], it may complain about these.

For React Native projects, I recommend using [`@react-native-community/eslint-config`](https://www.npmjs.com/package/@react-native-community/eslint-config) for consistency with the majority of the React Native community. New React Native CLI projects come preconfigured with `@react-native-community/eslint-config`. It includes support for Jest globals.

If you're using a different ESLint config, check out [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest) to add support for Jest globals.

If you aren't already using ESLint in your project, it's easy to install in a React Native project. Add the following packages:

```sh
yarn add --dev eslint@"^7.0" \
               @react-native-community/eslint-config
```

Then create an `.eslintrc.js` file at the root of your project and add the following:

```js
module.exports = {
  root: true,
  extends: '@react-native-community',
};
```

Then add a `.prettierrc.js` file with the following:

```js
module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
};
```

Most code editors can be configured to run ESLint rules as you edit. You can also add an NPM script to do so:

```diff
 "scripts": {
   "start": "expo start",
   "android": "expo start --android",
   "ios": "expo start --ios",
   "web": "expo start --web",
+  "lint": "eslint .",
   "eject": "expo eject"
 },
```

[eslint]: https://eslint.org/
[expo]: https://expo.io/
[jest]: https://jestjs.io/
