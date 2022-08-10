---
title: Testing Components
sidebar_position: 3
---
import Chat from '../_chat.mdx'

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

Let's test that it displays the right message when a name is passed in as a prop. Create a file `Hello.spec.js` at the root of your project and add the following:

```jsx
import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Hello from './Hello';

describe('Hello', () => {
  it('displays the passed-in name', () => {
    render(<Hello name="Josh" />);
    expect(screen.queryByText('Hello, Josh!')).toBeTruthy();
  });
});
```

Here's what's going on:

- `render()` renders the component to an in-memory representation that doesn't require an iOS or Android environment.
- `queryByText()` finds a child component that contains the passed-in text, or null if it's not found
- `expect()` creates a Jest expectation to check a condition. `.toBeTruthy()` checks that the value is truthy, which will be the case when an element is found and not when one is not found.

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
import {fireEvent, render, screen} from '@testing-library/react-native';
import NewMessageForm from './NewMessageForm';

describe('NewMessageForm', () => {
  describe('clicking send', () => {
    it('clears the message field', () => {
      render(<NewMessageForm />);

      fireEvent.changeText(screen.getByPlaceholderText('Message'), 'Hello world');
      fireEvent.press(screen.getByText('Send'));
    });
  });
});
```

The two `getBy` functions let us retrieve elements: `getByText` looking for `Text` components, and `getByPlaceholderText` looking for a placeholder within a `TextInput`.

`fireEvent` lets us fire an event on an element; specifically here we want the `changeText` event on the text field, and the `press` event on the button.

Now we need to actually check that the message field is cleared.

```diff
   fireEvent.changeText(screen.getByPlaceholderText('Message'), 'Hello world');
   fireEvent.press(screen.getByText('Send'));
+
+  expect(screen.getByPlaceholderText('Message')).toHaveProp('value', '');
 });
```

The `value` prop of the `TextInput` is what it displays, so we can check that prop to see that it is currently displaying the empty string.

If you get the error `TypeError: expect(...).toHaveProp is not a function`, check your [setup](./setup.md) to make sure you've correctly configured a `setupFilesAfterEnv` file that sets up jest-native.

## Verifying Actions

The other thing we want to confirm is that the `onSend` action is called. We can do this using a [Jest mock function](https://jestjs.io/docs/mock-functions). A mock allows us to inspect whether it has been called, and with what arguments.

```jsx
it('calls the onSend prop', () => {
  const messageText = 'Hello world';
  const sendHandler = jest.fn();
  render(<NewMessageForm onSend={sendHandler} />);

  fireEvent.changeText(screen.getByPlaceholderText('Message'), 'Hello world');
  fireEvent.press(screen.getByText('Send'));

  expect(sendHandler).toHaveBeenCalledWith(messageText);
});
```

<Chat />
