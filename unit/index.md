---
title: Unit Tests
---

The phrase "unit testing" is used to mean a lot of different things by a lot of different people. In this case, we're using "unit testing" to refer to tests of functions and plain JavaScript objects, independent of the React Native framework. This means that we aren't testing any components that rely on React Native.

React Native CLI installs the [Jest][jest] testing framework by default, so that's what we'll be using.

Another popular unit testing option is Mocha. The component and end-to-end testing tools described on this site work with either Jest and Mocha. There are a few advantages to Jest:

- Jest includes more out-of-the-box than Mocha, so you have less setup to do, and docs you find online will tend to be more unified.
- Jest includes snapshot testing. I don't strongly recommend snapshot testing, but it's nice to have the option so you can experiment with it to see if it adds value.

## Running Jest Tests

React Native apps created with React Native CLI have an NPM script pre-configured to run Jest:

```
# yarn test
```

## Smoke Test

To confirm Jest is working, create a `tests` folder, a `unit` folder under that, then create a `tests/unit/smoke.spec.js` file. Add the following contents:

```javascript
describe('truth', () => {
  it('is true', () => {
    expect(true).toEqual(true);
  });
});
```

Run the tests with `yarn test`. You should see output like the following:

```
# yarn test
yarn run v1.7.0
$ jest
 PASS  tests/unit/smoke.spec.js
  truth
    ✓ is true (4ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.681s
Ran all test suites.
✨  Done in 15.60s.
```

## Testing a Function

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
import formatAddress from '../../formatAddress';

describe('formatAddress', () => {
  it('returns the formatted address', () => {
    const addressObject = {
      street1: '123 Main Street',
      street2: 'Apartment 456',
      city: 'Atlanta',
      state: 'GA',
      zip: '30307',
    };

    const result = formatAddress(addressObject);
    const expected = '123 Main Street\nApartment 456\nAtlanta, GA 30307';

    expect(result).toEqual(expected);
  });
});
```

Run the tests again and they should pass.

For more practice, try writing another `it()` that specifies what happens when there is no street2 value. Try writing another for what the function *should* do if there is no street1 *or* street2, to see the tests fail. Update the code to handle that case, rerun the tests, and watch them pass.

## Learning More

For more details on how to use Jest, check out [the Jest web site][jest].

[jest]: https://jestjs.io/
