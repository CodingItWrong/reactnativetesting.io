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
  function testID(id) {
    return cmp => cmp.props().testID === id;
  }

  it('displays the passed-in name', () => {
    const wrapper = shallow(<Hello name="world" />);
    const greeting = wrapper.findWhere(testID('greeting'));
    expect(greeting.props().children.join('')).to.equal('Hello, world!');
  });
});
```

Here's what's going on:

- `shallow()` renders the component to an in-memory representation that doesn't require an iOS or Android environment
- `findWhere()` finds a child component for which a passed-in function returns true.
- `testID(id)` returns a function that matches elements with the provided test ID.
- `props().children` returns the children of the component, which in this case all happen to be text strings. Because there is a dynamic portion in the middle, we get an array of three elements: `["Hello, ", "world", "!"]`. `join('')` combines it into a single string, the way we see it on the screen.
- `expect()` creates a Chai expectation to check a condition. `.to.equal()` checks that the two values are equal; in this case, that the element really does contain the string we expect.

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
