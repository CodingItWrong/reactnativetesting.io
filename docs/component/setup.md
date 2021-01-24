---
title: Setting Up React-Native-Testing-Library
---

# Setting Up React-Native-Testing-Library

## Installing React-Native-Testing-Library

We'll be using react-native-testing-library with the Jest test runner. If you haven't already, [set up Jest](/unit/setup.html).

Now we'll add react-native-testing-library:

```bash
$ yarn add --dev @testing-library/react-native
```

## Smoke Test

To confirm it's working, let's write a trivial component and test it.

At the root of your project, create a `Hello.js` file and enter the following contents:

```jsx
import React from 'react';
import {Text} from 'react-native';

const Hello = () => <Text>Hello, world!</Text>;

export default Hello;
```

Next, create a `__tests__` folder if there isn't one already, then add a `Hello.spec.js` file in it with the following contents:

```jsx
import React from 'react';
import {render} from '@testing-library/react-native';
import Hello from '../Hello';

describe('Hello', () => {
  it('renders the correct message', () => {
    const {queryByText} = render(<Hello />);
    expect(queryByText('Hello, world!')).not.toBeNull();
  });
});
```

Run your tests with `yarn test`. If you added the unit smoke test as well as the component smoke test, you should see the following output:

```bash
jest
 PASS  __tests__/smoke.spec.js
 PASS  __tests__/formatAddress.spec.js
 PASS  __tests__/Hello.spec.js

Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        3.781s
Ran all test suites.
✨  Done in 4.70s.
```
