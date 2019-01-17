---
title: Testing a Function
---

# Testing a Function

Let's create a more realistic example. Say we need to format a US address. Instead of putting this function directly in a React Native component, we can make it a standalone function. This will keep our component source code simpler, and it will also make the function easier to test.

Create a `formatAddress.js` at the root of your project and add the following:

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

Create a `test/unit/formatAddress.spec.js` file and add the following:

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

    expect(result).to.equal(expected);
  });
});
```

Run the tests again and they should pass.

For more practice, try writing another `it()` that specifies what happens when there is no street2 value. Try writing another for what the function _should_ do if there is no street1 _or_ street2, to see the tests fail. Update the code to handle that case, rerun the tests, and watch them pass.
