---
title: Testing Components
---

# Testing Components

Let's talk about the different features React Native Testing Library offers for testing components.

## Testing Text

Create a file `Hello.js` in the root of your project and enter the following:

```jsx
import React from 'react';
import {Text, View} from 'react-native';

export default function Hello({name}) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}
```

Let's test that it displays the right message when a name is passed in as a prop. Create a file `__tests__/Hello.spec.js` and add the following:

```jsx
import React from 'react';
import {render} from '@testing-library/react-native';
import Hello from '../Hello';

describe('Hello', () => {
  it('displays the passed-in name', () => {
    const {queryByText} = render(<Hello name="Josh" />);
    expect(queryByText('Hello, Josh!')).not.toBeNull();
  });
});
```

Here's what's going on:

- `render()` renders the component to an in-memory representation that doesn't require an iOS or Android environment.
- `queryByText()` finds a child component that contains the passed-in text, or null if it's not found
- `expect()` creates a Jest expectation to check a condition. `.not.toBeNull()` checks that the value is not null, which means that an element with that text was found.

## Interaction

We've tested the rendering of a component; now let's test out interacting with a component. Here's a simple form component for sending a message to a chat system:

```jsx
import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

export default function NewMessageForm({onSend}) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (onSend) {
      onSend(inputText);
    }
    setInputText('');
  };

  return (
    <View>
      <TextInput
        placeholder="Message"
        value={inputText}
        onChangeText={setInputText}
      />
      <Pressable onPress={handleSend}>
        <Text>Send</Text>
      </Pressable>
    </View>
  );
}
```

Let's start by simulating entering text and pressing the button:

```jsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import NewMessageForm from '../NewMessageForm';

describe('NewMessageForm', () => {
  describe('clicking send', () => {
    it('clears the message field', () => {
      const {getByPlaceholderText, getByText} = render(<NewMessageForm />);

      fireEvent.changeText(getByPlaceholderText('Message'), 'Hello world');
      fireEvent.press(getByText('Send'));
    });
  });
});
```

The two `getBy` functions let us retrieve elements: `getByText` looking for `Text` components, and `getByPlaceholderText` looking for a placeholder within a `TextInput`.

`fireEvent` lets us fire an event on an element; specifically here we want the `changeText` event on the text field, and the `press` event on the button.

Now we need to actually check that the message field is cleared.

```diff
     fireEvent.changeText(getByPlaceholderText('Message'), 'Hello world');
     fireEvent.press(getByText('Send'));
+
+    expect(getByPlaceholderText('Message').props.value).toEqual('');
   });
```

The `value` prop of the `TextInput` is what it displays, so we can check that prop to see that it is currently displaying the empty string.

## Verifying Actions

The other thing we want to confirm is that the `onSend` action is called. We can do this using a [Jest mock function](https://jestjs.io/docs/mock-functions). A mock allows us to inspect whether it has been called, and with what arguments.

```jsx
it('calls the send handler', () => {
  const messageText = 'Hello world';
  const sendHandler = jest.fn();
  const {getByTestId} = render(<NewMessageForm onSend={sendHandler} />);

  fireEvent.changeText(getByTestId('messageText'), messageText);
  fireEvent.press(getByTestId('sendButton'));

  expect(sendHandler).toHaveBeenCalledWith(messageText);
});
```

There's a good amount of duplication between our two tests. Let's extract the common setup to a `beforeEach()`. Here's the complete file:

```jsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import NewMessageForm from '../NewMessageForm';

describe('NewMessageForm', () => {
  describe('clicking send', () => {
    const messageText = 'Hello world';
    let sendHandler;
    let getByTestId;

    beforeEach(() => {
      sendHandler = jest.fn();
      ({getByTestId} = render(<NewMessageForm onSend={sendHandler} />));

      fireEvent.changeText(getByTestId('messageText'), 'Hello world');
      fireEvent.press(getByTestId('sendButton'));
    });

    it('clears the message field', () => {
      expect(getByTestId('messageText').props.value).toEqual('');
    });

    it('calls the send handler', () => {
      expect(sendHandler).toHaveBeenCalledWith(messageText);
    });
  });
});
```

Notice a few things:

- We create a few `let` variables so they can be set in the `beforeEach()` and accessed in the `it()`s.
- We reassign the `sendHandler` and `getByTestId` function for each test. Although that doesn't seem too necessary in this case, it's important for test isolation, so that one test doesn't affect state that another test relies on.
- We could just add two expectations to a single test. But it's good test practice to expect one thing per test case. This doesn't necessarily mean that there has to be only one `expect()` statement (although it often does). It just means that each `it()` should test for something very specific. Test names can help with this: if you can't write a clear and simple test description, you're probably testing for too much. In our case, there are two fairly unrelated things that happen as part of tapping the send button: the text field is cleared, and the send handler is called.
