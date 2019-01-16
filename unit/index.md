---
title: Unit Tests
---

The phrase "unit testing" is used to mean a lot of different things by a lot of different people. In this case, we're using "unit testing" to refer to tests of functions and plain JavaScript objects, independent of the React Native framework. This means that we aren't testing any components that rely on React Native.

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

## Testing a Function

TODO: update to Mocha

Let's create a more realistic example. Say we need to format a US address. Instead of putting this function directly in a React Native component, we can make it a standalone function. This will keep our component source code simpler, and it will also make the function easier to test.

```javascript
function formatAddress(address) {
  const addressLines = [];

  addressLines.push(address.street1);
  if (address.street2) {
    addressLines.push(address.street2);
  }
  addressLines.push(`${address.city}, ${address.state} ${address.zip}`);

  return addressLines.join("\n");
}

export default formatAddress;
```

Create a `tests/unit/formatAddress.spec.js` file and add the following:

```javascript
import formatAddress from "../../formatAddress";

describe("formatAddress", () => {
  it("returns the formatted address", () => {
    const addressObject = {
      street1: "123 Main Street",
      street2: "Apartment 456",
      city: "Atlanta",
      state: "GA",
      zip: "30307"
    };

    const result = formatAddress(addressObject);
    const expected = "123 Main Street\nApartment 456\nAtlanta, GA 30307";

    expect(result).toEqual(expected);
  });
});
```

Run the tests again and they should pass.

For more practice, try writing another `it()` that specifies what happens when there is no street2 value. Try writing another for what the function _should_ do if there is no street1 _or_ street2, to see the tests fail. Update the code to handle that case, rerun the tests, and watch them pass.

## Learning More

For more details on how to use Mocha, check out the documentation for each of the libraries:

- [Mocha][mocha]
- [Chai][chai]
- [Sinon][sinon]

[mocha]: https://mochajs.org/#table-of-contents
[chai]: https://www.chaijs.com/guide/
[sinon]: https://sinonjs.org/#get-started
