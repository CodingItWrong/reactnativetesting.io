---
title: Testing Components
sidebar_position: 3
---
import Chat from '../_chat.mdx'

# Testing Components

Let's talk about the different features React Native Testing Library offers for testing components.

## Testing Text

Create a file `Hello.js` in the root of your project and enter the following (if you created the `Hello.js` file on the previous page, replace its contents with the following):

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

Let's test that it displays the right message when a name is passed in as a prop. Create a file `Hello.spec.js` at the root of your project and add the following (if you created the `Hello.spec.js` file on the previous page, replace its contents with the following):

```jsx
import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Hello from './Hello';

describe('Hello', () => {
  it('displays the passed-in name', () => {
    render(<Hello name="Josh" />);
    expect(screen.getByText('Hello, Josh!')).toBeVisible();
  });
});
```

Here's what's going on:

- `render()` renders the component to an in-memory representation that doesn't require an iOS or Android environment.
- `screen.getByText()` finds a child component that contains the passed-in text, or raises an error if it's not found.
- `expect()` creates a Jest expectation to check a condition.
- `.toBeVisible()` confirms that the element was not only found, but is also visible to users. This provides extra realism.

## Testing Images

What about when you want to confirm the presence of an image or icon that doesn't have any associated text?

In this case, accessibility comes to the rescue. For visually impaired users to be able to use your app, it's a good idea for every image and icon to have *some* associated text. If there isn't any text visible on the screen, you can provide an `accessibilityLabel`. This has two benefits:

- It gives screen reader software the ability to read out a description of the image or icon to visually-impaired users, and
- It gives you something to query against in your tests.

Say we have an `Image` in our `Hello` component:

```jsx
import {Image, Text, View} from 'react-native';

export default function Hello({name = 'World'}) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
      <Image source={require('./assets/squirrel.jpg')} />
    </View>
  );
}
```

How can we confirm that the `Image` is displayed? First, we add an `accessibilityLabel` to it:

```diff
 <View>
   <Text>Hello, {name}!</Text>
   <Image
     source={require('./assets/squirrel.jpg')}
+    accessibilityLabel="squirrel waving"
   />
 </View>
```

Next, we search for it in our test using the `getByLabelText` matcher:

```js
it('displays the squirrel image', () => {
  expect(screen.getByLabelText('squirrel waving')).toBeVisible();
});
```

This test will pass.

What about SVGs? A common way to use SVGs in React Native is with [`react-native-svg-transformer`](https://github.com/kristerkari/react-native-svg-transformer), which allows you to import `.svg` files as components. Using it looks like this:

```jsx
import {Image, Text, View} from 'react-native';
import WavingHand from './assets/waving-hand.svg';

export default function Hello({name = 'World'}) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
      <WavingHand
        fill="gray"
        width={100}
        height={100}
      />
    </View>
  );
}
```

SVGs can be tested in the same way: by adding an `accessibilityLabel`:

```diff
 <WavingHand
   fill="gray"
   width={100}
   height={100}
+  accessibilityLabel="waving hand"
 />
```

The test looks like this:

```js
it('displays the waving hand icon', () => {
  expect(screen.getByLabelText('waving hand')).toBeVisible();
});
```

Although `getByLabelText` helps with accessibility, note that *it does not confirm your app is fully accessible to screen readers!* In the examples above, the image and SVG won't be interactable by iOS VoiceOver unless you also add the `accessible` prop. Be sure to test your app with screen reader software; the `getByLabelText` matcher can just serve as a helpful reminder to make your images and SVGs accessible.

To learn more about accessibility in React Native, check out [Ankita Kulkarni's talk "Make your React Native Apps Accessible"](https://youtu.be/3LLQ5AshtNc) from Chain React 2019.

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
  const sendHandler = jest.fn().mockName('sendHandler');
  render(<NewMessageForm onSend={sendHandler} />);

  fireEvent.changeText(screen.getByPlaceholderText('Message'), 'Hello world');
  fireEvent.press(screen.getByText('Send'));

  expect(sendHandler).toHaveBeenCalledWith(messageText);
});
```

<Chat />
