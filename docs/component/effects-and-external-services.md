---
title: Effects and External Services
---

# Testing with useEffect

We don't test `useEffect()` hooks directly; we test the user-visible results they have.

Say have a component that loads some data from a web service upon mount and displays it:

```jsx
import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import api from './api';

export default function WidgetContainer() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    api.get('/widgets').then((response) => {
      setWidgets(response.data);
    });
  }, []);

  return (
    <View>
      {widgets.map((widget) => (
        <Text key={widget.id}>{widget.name}</Text>
      ))}
    </View>
  );
}
```

Here's our initial attempt at a test:

```js
import React from 'react';
import {render} from '@testing-library/react-native';
import WidgetContainer from '../WidgetContainer';

describe('WidgetContainer', () => {
  it('loads widgets upon mount', () => {
    const {queryByText} = render(<WidgetContainer />);

    expect(queryByText('Widget 1')).not.toBeNull();
    expect(queryByText('Widget 2')).not.toBeNull();
  });
});
```

But the calls to `queryByText()` return `null`--the text is not found. This is because the test doesn't wait for the web service to return.

We can confirm this by adding console.log statements:

```diff
 useEffect(() => {
+  console.log('sent request');
   api.get('/widgets').then((response) => {
+    console.log('got response');
     setWidgets(response.data);
   });
 }, []);
```

In the test, we can see that we sent the request, but didn't get the response before the test finished.

How can we fix this?

One way is to make the test wait for some time before it checks:

```diff
 it('loads widgets upon mount', () => {
   const {queryByText, debug} = render(<WidgetContainer />);

-  expect(queryByText('Widget 1')).not.toBeNull();
-  expect(queryByText('Widget 2')).not.toBeNull();
+  return new Promise((resolve, reject) => {
+    setTimeout(() => {
+      expect(queryByText('Widget 1')).not.toBeNull();
+      expect(queryByText('Widget 2')).not.toBeNull();
+      resolve();
+    }, 1000);
+  });
 });
```

The test passes. There is a React `act()` warning that we would want to find a way to fix if we kept this test approach:

```
Warning: An update to WidgetContainer inside a test was not wrapped in act(...).
```

But *do* we want to keep this test approach? There are a few other downsides to it as well:

- If the request takes too long, the test can fail sometimes.
- To get around this, you have to set the delay to a longer time, which slows down your whole test suite.
- And if the remote server goes down, your test will fail.

## Mocking a Module

As an alternative, let's use Jest module mocks to replace the API call with one we create.

First let's restore our test to before we added the Promise:

```js
import React from 'react';
import {render} from '@testing-library/react-native';
import WidgetContainer from '../WidgetContainer';

describe('WidgetContainer', () => {
  it('loads widgets upon mount', () => {
    const {queryByText} = render(<WidgetContainer />);

    expect(queryByText('Widget 1')).not.toBeNull();
    expect(queryByText('Widget 2')).not.toBeNull();
  });
});
```

Next, mock the API module that the `WidgetContainer` uses:

```diff
 import WidgetContainer from '../WidgetContainer';
+import api from '../api';
+
+jest.mock('../api');
+
 describe('WidgetContainer', () => {
```

Now we get a different error:

```
TypeError: Cannot read property 'then' of undefined

   8 |   useEffect(() => {
   9 |     console.log('sent request');
> 10 |     api.get('/widgets').then((response) => {
     |     ^
```

So our call to `api.get()` returns undefined. This is because `jest.mock()` replaces each function in the default export object with a mock function that by default returns `undefined`. Since the real `api` returns a promise that resolves, we should set the mocked function to resolve as well.

```diff
 it('loads widgets upon mount', () => {
+  api.get.mockResolvedValue();
+
   const {queryByText} = render(<WidgetContainer />);
```

Now our test no longer errors out, but we still get expectation failures that our results are `null`. This is because `api.get()` is now returning a promise that resolves. We also get a warning about an unhandled promise rejection:

```
TypeError:
Cannot read property 'data' of undefined

  10 |     api.get('/widgets').then((response) => {
  11 |       console.log('got response');
> 12 |       setWidgets(response.data);
     |                           ^
```

So we want to resolve to data that the component expects.

```diff
-api.get.mockResolvedValue();
+api.get.mockResolvedValue({
+  data: [
+    {id: 1, name: 'Widget 1'},
+    {id: 2, name: 'Widget 2'},
+  ],
+});
```

This isn't a full Axios response object; all we need to add are the fields the component is using.

Now the promise is no longer rejecting. There's the `act()` warning again that we will need to address eventually. But also, we are still getting `null` outputted. Why?

We can find out by using `debug()`, which will output a representation of our component tree to the test logs:

```diff
-const {queryByText} = render(<WidgetContainer />);
+const {queryByText, debug} = render(<WidgetContainer />);
+
+debug();

 expect(queryByText('Widget 1')).not.toBeNull();
```

The logged component tree we get is simply:

```jsx
<View />
```

Why would that be? Our API is being called and is responding. This is because our test runs on the same tick of the event loop, so React doesn't have time to get the response and render. We need to wait for the rerender for the element to be displayed on the screen. We can do this by using the asynchronous `findByText()` instead:

```diff
-const {queryByText, debug} = render(<WidgetContainer />);
+const {findByText, debug} = render(<WidgetContainer />);

 debug();

-expect(queryByText('Widget 1')).not.toBeNull();
-expect(queryByText('Widget 2')).not.toBeNull();
+await findByText('Widget 1');
+await findByText('Widget 2');
```

To use `await` we also need to change the test function to be an `async` function:

```diff
 describe('WidgetContainer', () => {
-  it('loads widgets upon mount', () => {
+  it('loads widgets upon mount', async () => {
     api.get.mockResolvedValue({
```

Now the tests passes.

Now we can remove debug and log statements to keep our test output clean.

```diff
+const {findByText} = render(<WidgetContainer />);
-const {findByText, debug} = render(<WidgetContainer />);
-
-debug();

 await findByText('Widget 1');
```
