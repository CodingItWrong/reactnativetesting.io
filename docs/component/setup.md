---
title: Setting Up React Native Testing Library and jest-native
sidebar_position: 2
---

# Setting Up React Native Testing Library and jest-native

## Installing React Native Testing Library

We'll be using React Native Testing Library with the Jest test runner. If you haven't already, [set up Jest](/docs/unit/setup).

Now we'll add React Native Testing Library:

```bash
$ yarn add --dev @testing-library/react-native
```

## Installing jest-native

We'll be adding jest-native to add some additional test matchers. First, add the dependency:

```bash
$ yarn add --dev @testing-library/jest-native
```

Next, if you don't already have a `setupFilesAfterEnv` file configured for Jest, add one to your Jest config in `package.json`:

```diff
 "jest": {
   "preset": "[react-native or jest-expo]",
+  "setupFilesAfterEnv": ["./jest-setup-after-env.js"]
 }
```

(Note that if you already have a `setupFiles` entry, `setupFilesAfterEnv` is different.)

If the setup file doesn't already exist, create an empty file at that location.

Add the following line to the file pointed to by `setupFilesAfterEnv`:

```js
import '@testing-library/jest-native/extend-expect';
```

## Smoke Test

To confirm it's working, let's write a trivial component and test it.

At the root of your project, create a `Hello.js` file and enter the following contents:

```jsx
import React from 'react';
import {Text} from 'react-native';

export default function Hello() {
  return <Text>Hello, world!</Text>;
}
```

Next, add a `Hello.spec.js` file at the root of your project with the following contents:

```jsx
import React from 'react';
import {render} from '@testing-library/react-native';
import Hello from './Hello';

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
 PASS  ./smoke.spec.js
 PASS  ./formatAddress.spec.js
 PASS  ./Hello.spec.js

Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        3.781s
Ran all test suites.
✨  Done in 4.70s.
```
