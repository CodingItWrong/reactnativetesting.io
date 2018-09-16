---
title: Enzyme Setup
---

To use Enzyme with React Native 0.56, we need to switch from the Jest test runner that comes pre-installed with React Native to another test runner, Mocha. Jest has some issues that prevent it from running in React Native 0.56.

So let's uninstall Jest:

```bash
$ yarn remove jest babel-jest
```

Let's also remove Jest-related configuration from `package.json`:

```diff
   "scripts": {
-    "start": "node node_modules/react-native/local-cli/cli.js start",
-    "test": "jest"
+    "start": "node node_modules/react-native/local-cli/cli.js start"
   },
   "dependencies": {
     "react": "16.4.1",
     "react-native": "0.56.1"
   },
   "devDependencies": {
     "babel-preset-react-native": "^5",
     "react-test-renderer": "16.4.1"
-  },
-  "jest": {
-    "preset": "react-native"
   }
 }
```

Next, let's install Mocha and its related testing packages:

```bash
$ yarn add --dev mocha chai sinon sinon-chai
```

Now we'll add Enzyme to enable component testing:

```bash
$ yarn add --dev enzyme \
                 enzyme-adapter-react-16 \
                 @jonny/react-native-mock
```

Now that these packages are installed, we need to configure them to work together. Create a tests/setup.js script and add the following:

```javascript
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '@jonny/react-native-mock/mock';
import chai from 'chai';
import sinonChai from 'sinon-chai';

Enzyme.configure({ adapter: new Adapter() });
chai.use(sinonChai);
```

This does the following:
- Loads `@jonny/react-native-mock` so we can access React Native APIs in component tests
- Configure Enzyme to work with React 16
- Configure Chai to use the sinon-chai assertion library

Next, we'll set up a `test` command that will run Mocha with the appropriate setup:

```diff
   "scripts": {
-    "start": "node node_modules/react-native/local-cli/cli.js start"
+    "start": "node node_modules/react-native/local-cli/cli.js start",
+    "test": "mocha --require @babel/register --require tests/setup.js tests/**/*.spec.js"
   },
```

## Smoke Test

To confirm it's working, let's write a trivial component and test it.

At the root of your project, create a `Hello.js` file and enter the following contents:

```jsx
import React, { Component } from 'react';
import { Text } from 'react-native';

const Hello = () => <Text>Hello, world!</Text>;

export default Hello;
```

Next, create a `tests/components` folder, then add a `Hello.spec.js` file in it with the following contents:

```jsx
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import Hello from '../../Hello';

describe('Hello', () => {
  it('renders the correct message', () => {
    const wrapper = shallow(<Hello />);
    expect(wrapper.contains('Hello, world!')).to.be.true;
  });
});
```

Run your tests with `yarn test`. You should see the following output:

```bash
$ yarn test
yarn run v1.9.4
$ mocha --require @babel/register --require tests/setup.js tests/**/*.spec.js


  Hello
    ✓ renders the correct message


  1 passing (16ms)

✨  Done in 1.26s.
```

[enzyme]: http://airbnb.io/enzyme/
