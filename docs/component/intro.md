---
title: Component Tests
sidebar_position: 1
---
import Chat from '../_chat.mdx'

# Component Tests

Component tests are tests of individual React Native components apart from where they are used in an application. You can create an instance of the component, pass it props, interact with it, and see how it behaves. This can make it quicker and easier to arrange edge cases that would be slow and difficult to set up with end-to-end tests.

[React Native Testing Library][react-native-testing-library] allows you to test React Native components, verifying the component tree they render and allowing you to interact with them. [jest-native][jest-native] provides custom matchers that make your tests more readable.

<Chat />

[react-native-testing-library]: https://callstack.github.io/react-native-testing-library/
[jest-native]: https://github.com/testing-library/jest-native#readme
