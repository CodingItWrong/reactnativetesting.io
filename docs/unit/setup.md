---
title: Setting Up Mocha
---

# Setting Up Mocha

React Native CLI installs the Jest testing framework by default, but in the last few versions of React Native it's had some stability issues.

Instead, we'll use the [Mocha][mocha] test framework. Its syntax is very similar to Jest. It takes a little work to set up, but it's worth it!

## Removing Jest

First, let's remove Jest since we won't be using it. If you're using Expo Jest is not installed by default. If you're using React Native CLI, run the following:

```sh
$ yarn remove jest babel-jest
```

Then, remove the following config and script from `package.json`:

```diff
   "scripts": {
-    "start": "node node_modules/react-native/local-cli/cli.js start",
-    "test": "jest"
+    "start": "node node_modules/react-native/local-cli/cli.js start"
   },
...
     "metro-react-native-babel-preset": "0.51.1",
     "react-test-renderer": "16.6.3"
-  },
-  "jest": {
-    "preset": "react-native"
   }
```

## Installing Mocha

Mocha's ecosystem is split into several separate packages. We'll install the following, which are typically used together:

- [Mocha][mocha], the test runner
- [Chai][chai], the assertion library
- [Sinon][sinon], the test double library
- `sinon-chai`, which allows for running more readable expectations against Sinon test doubles

Install all of them:

```sh
$ yarn add --dev mocha \
                 chai \
                 sinon \
                 sinon-chai
```

Next, add an NPM script to run mocha:

```diff
   "scripts": {
-    "start": "node node_modules/react-native/local-cli/cli.js start"
+    "start": "node node_modules/react-native/local-cli/cli.js start",
+    "test": "mocha \"test/**/*.spec.js\""
   },
```

Create a `test` folder at the root of your project, then add a `mocha.opts` file to configure mocha. Add the following to it:

```sh
--require @babel/register
--require chai/register-expect
--require test/setup
```

These flags do the following:

- Enables Babel transpilation so you can use modern JS features
- Sets up the `expect()` function so you can use it in any file without importing it
- Loads a custom `setup.js` file you'll create for additional setup

Let's create that `test/setup.js` file now and add the following:

```js
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

global.sinon = sinon;
chai.use(sinonChai);
```

This does the following:

- Makes `sinon` available globally so you don't need to import it
- Loads `sinon-chai` so you can do more readable assertions against Sinon test doubles

With this, our setup should be done.

## Smoke Test

To confirm Mocha is working, create a `test/unit` folder, then create a `test/unit/smoke.spec.js` file. Add the following contents:

```javascript
describe("truth", () => {
  it("is true", () => {
    expect(true).to.equal(true);
  });
});
```

Run the tests with `yarn test`. You should see output like the following:

```bash
$ yarn test
yarn run v1.13.0
$ mocha "test/**/*.spec.js"


  truth
    ✓ is true


  1 passing (29ms)
```

## Configuring ESLint

Mocha has a number of globally-available functions, and we've set up Chai and Sinon to use globals as well, so ESLint will complain about these. We can fix this by adding them to the list of globals ESLint will accept:

```diff
   'es6': true,
     'node': true,
   },
+  globals: {
+    'after': true,
+    'afterEach': true,
+    'before': true,
+    'beforeEach': true,
+    'describe': true,
+    'expect': true,
+    'it': true,
+    'sinon': true
+  },
   rules: {
     'react/prop-types': 'off',
   }
```
