---
title: Component Tests
---

Component tests are tests of individual React Native components apart from where they are used in an application. You can create an instance of the component, pass it props, interact with it, and see how it behaves. This can make it quicker and easier to arrange edge cases that would be slow and difficult to set up with end-to-end tests.

[Enzyme][enzyme] is a library allows you to test React and React Native components, verifying the component tree they render and allowing you to interact with them.

- [Setting Up Enzyme](setup)
- [Testing Components](testing)

## Learning More

- For more details on how to use Enzyme, check out [the Enzyme web site][enzyme].
- Jack Franklin has an excellent [video course on Testing React with Enzyme and Jest][testing-react-enzyme]. It's for React Web, but the principles apply exactly to React Native as well. The first five videos are free.

[enzyme]: http://airbnb.io/enzyme/
[testing-react-enzyme]: https://javascriptplayground.com/testing-react-enzyme-jest/
