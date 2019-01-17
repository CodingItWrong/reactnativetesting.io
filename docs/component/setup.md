---
title: Setting Up Enzyme
---

## Installing Enzyme

We'll be using Enzyme with the Mocha test runner. If you haven't already, [install Mocha](/unit/setup.html).

Now we'll add Enzyme and a few related packages to enable component testing:

```bash
$ yarn add --dev enzyme \
                 enzyme-adapter-react-16 \
                 @jonny/react-native-mock
```

Now that these packages are installed, we need to configure them to work together. In your `test/setup.js` file, add the following:

```diff
 import chai from 'chai';
 import sinon from 'sinon';
 import sinonChai from 'sinon-chai';
+import Enzyme from 'enzyme';
+import Adapter from 'enzyme-adapter-react-16';
+import '@jonny/react-native-mock/mock';

 global.sinon = sinon;
 chai.use(sinonChai);
+Enzyme.configure({ adapter: new Adapter() });
```

This does the following:
- Loads `@jonny/react-native-mock` so we can access React Native APIs in component tests
- Configures Enzyme to work with React 16

## Smoke Test

To confirm it's working, let's write a trivial component and test it.

At the root of your project, create a `Hello.js` file and enter the following contents:

```jsx
import React, { Component } from 'react';
import { Text } from 'react-native';

const Hello = () => <Text>Hello, world!</Text>;

export default Hello;
```

Next, create a `test/components` folder, then add a `Hello.spec.js` file in it with the following contents:

```jsx
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

Run your tests with `yarn test`. If you added the unit smoke test as well as the component smoke test, you should see the following output:

```bash
$ yarn test
yarn run v1.13.0
$ mocha "test/**/*.spec.js"


  Hello

    ✓ renders the correct message

  truth
    ✓ is true


  2 passing (32ms)
```

[enzyme]: http://airbnb.io/enzyme/
