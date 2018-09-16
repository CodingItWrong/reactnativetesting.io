---
title: Testing Components
---

Let's talk about the different features Enzyme offers for testing components.

## Testing Text

Create a file `Hello.js` in the root of your project and enter the following:

```jsx
import React from 'react';
import {
  Text,
  View,
} from 'react-native';

const Hello = ({ name }) => (
  <View>
    <Text testID="greeting">Hello, {name}!</Text>
  </View>
);

export default Hello;
```

Let's test that it displays the right message when a name is passed in as a prop. Create a file `tests/components/Hello.spec.js` and add the following:

```jsx
import React from 'react';
import { shallow } from 'enzyme';

import Hello from '../../Hello';

describe('Hello', () => {
  it('displays the passed-in name', () => {
    const wrapper = shallow(<Hello name="world" />);
    expect(wrapper.find('Text').props().children.join('')).toEqual('Hello, world!');
  });
});
```

Here's what's going on:

- `shallow()` renders the component to an in-memory representation that doesn't require an iOS or Android environment
- `find('Text')` finds a child component with the component name "Text".
- `props().children` returns the children of the component, which in this case all happen to be text strings. Because there is a dynamic portion in the middle, we get an array of three elements: `["Hello, ", "world", "!"]`. `join('')` combines it into a single string, the way we see it on the screen.
- `expect()` creates a Jest expectation to check a condition. `.toEqual()` checks that the two values are equal; in this case, that the element really does contain the string we expect.

## Test IDs

This works, but it's a bit fragile. Say we start rendering add an additional Text child component:

```diff
 import React from 'react';
 import {
   Text,
   View,
 } from 'react-native';

 const Hello = ({ name }) => (
   <View>
     <Text>Hello, {name}!</Text>
+    <Text>It's nice to see you!</Text>
   </View>
 );

 export default Hello;
```

If we rerun our test, we get this error:

```bash
Method “props” is only meant to be run on a single node. 2 found instead.

   7 |   it('displays the passed-in name', () => {
   8 |     const wrapper = shallow(<Hello name="world" />);
>  9 |     expect(wrapper.find('Text').props().children.join('')).toEqual('Hello, world!');
     |                                 ^
  10 |   });
  11 | });
```

Our test was coupled to the fact that there would only be one Test element, so now that we added another one, it broke.

This isn't something our test should care about. Really, it just wants to be able to find the hello message. We can accomplish this by adding a `testID` prop to the element:

```diff
   <View>
-    <Text>Hello, {name}!</Text>
+    <Text testID="greeting">Hello, {name}!</Text>
     <Text>It's nice to see you!</Text>
   </View>
```

Next, we change our test to find a component by `testID`:

```diff
 it('displays the passed-in name', () => {
   const wrapper = shallow(<Hello name="world" />);
+  const greeting = wrapper.findWhere(cmp => cmp.props().testID === 'greeting');
+  expect(greeting.props().children.join('')).toEqual('Hello, world!');
-  expect(wrapper.find('Text').props().children.join('')).toEqual('Hello, world!');
 });
```

To make our test easier to read, we can extract this lookup function:

```diff
+function testID(id) {
+  return cmp => cmp.props().testID === id;
+}

 it('displays the passed-in name', () => {
   const wrapper = shallow(<Hello name="world" />);
-  const greeting = wrapper.findWhere(cmp => cmp.props().testID === 'greeting');
+  const greeting = wrapper.findWhere(testID('greeting'));
   expect(greeting.props().children.join('')).toEqual('Hello, world!');
 });
```

## Interaction

We've tested the rendering of a component; now let's test out interacting with a component. Here's a simple form component for sending a message to a chat system:

```jsx
import React, { Component } from 'react';
import {
  Button,
  TextInput,
  View,
} from 'react-native';

export default class NewMessageForm extends Component {
  constructor(params) {
    super(params);
    this.state = { inputText: '' };
  }

  handleChangeText(text) {
    this.setState({ inputText: text });
  }

  handleSave() {
    const { inputText } = this.state;
    const { onSave } = this.props;

    if (onSave) {
      onSave(inputText);
    }

    this.setState({ inputText: '' });
  }

  render() {
    const { inputText } = this.state;
    return (
      <View>
        <TextInput
          value={inputText}
          testID="messageText"
          onChangeText={text => this.handleChangeText(text)}
        />
        <Button
          title="Save"
          testID="saveButton"
          onPress={() => this.handleSave()}
        />
      </View>
    );
  }
}
```

Let's start by simulating entering text and pressing the button:

```jsx
import React from 'react';
import {
  Button,
  TextInput,
} from 'react-native';
import { shallow } from 'enzyme';

import NewMessageForm from '../../NewMessageForm';

describe('NewMessageForm', () => {
  function testID(id) {
    return cmp => cmp.props().testID === id;
  }

  describe('clicking save', () => {
    it('clears the message field', () => {
      const wrapper = shallow(<NewMessageForm onSave={saveHandler} />);

      wrapper.findWhere(testID('messageText')).simulate('changeText', 'Hello world');
      wrapper.findWhere(testID('saveButton')).simulate('press');
    });
  });
});
```

Note that the first argument we pass to `simulate()` is the name of the action property, with the `on` prefix removed. Note that we can also pass the argument to the action.

Now we need to actually check that the message field is cleared.

```diff
   wrapper.findWhere(testID('messageText')).simulate('changeText', 'Hello world');
   wrapper.findWhere(testID('saveButton')).simulate('press');
+
+  expect(wrapper.findWhere(testID('messageText')).props().value).toEqual('');
 });
```

The `value` prop of the `TextInput` is what it displays, so we can check that prop to see that it is currently displaying the empty string.

## Verifying Actions

The other thing we want to confirm is that the `onSave` action is called. We can do this using a Jest mock function. A mock function allows us to inspect whether it has been called, and with what arguments.

```jsx
it('calls the save handler', () => {
  const saveHandler = jest.fn();
  const wrapper = shallow(<NewMessageForm onSave={saveHandler} />);

  wrapper.findWhere(testID('messageText')).simulate('changeText', messageText);
  wrapper.findWhere(testID('saveButton')).simulate('press');

  expect(saveHandler).toHaveBeenCalledWith(messageText);
});
```

There's a good amount of duplication between our two tests. Let's extract the common setup to a `beforeEach()`. Here's the complete file:

```jsx
import React from 'react';
import { shallow } from 'enzyme';
import NewMessageForm from '../../NewMessageForm';

describe('NewMessageForm', () => {
  function testID(id) {
    return cmp => cmp.props().testID === id;
  }

  describe('clicking save', () => {
    const messageText = 'Hello world';

    let wrapper;
    let saveHandler;

    beforeEach(() => {
      saveHandler = jest.fn();
      wrapper = shallow(<NewMessageForm onSave={saveHandler} />);

      wrapper.findWhere(testID('messageText')).simulate('changeText', messageText);
      wrapper.findWhere(testID('saveButton')).simulate('press');
    });

    it('clears the message field', () => {
      expect(wrapper.findWhere(testID('messageText')).props().value).toEqual('');
    });

    it('calls the save handler', () => {
      expect(saveHandler).toHaveBeenCalledWith(messageText);
    });
  });
});
```

Notice a few things:

- We create a few `let` variables so they can be set in the `beforeEach()` and accessed in the `it()`s.
- We recreate the `saveHandler` and `wrapper` for each test. Although that doesn't seem too necessary in this case, it's important for test isolation, so that one test doesn't affect state that another test relies on.
- We could just add two expectations to a single test. But it's good test practice to expect one thing per test case. This doesn't necessarily mean that there has to be only one `expect()` statement (although it often does). It just means that each `it()` should test for something very specific. Test names can help with this: if you can't write a clear and simple test description, you're probably testing for too much. In our case, there are two fairly unrelated things that happen as part of tapping the save button: the text field is cleared, and the save handler is called.
