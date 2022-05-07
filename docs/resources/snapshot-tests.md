---
title: What About Snapshot Tests?
sidebar_position: 2
---

# What About Snapshot Tests?

Snapshot tests are a feature Jest provides to automatically record the output of a function and check it against future runs of the function to ensure things haven't changed. When they do change, they provide a simple interface for viewing the diffs and accepting or rejecting them.

This is initially appealing because it makes it quicker to write tests, and it can catch more subtle changes that manual component tests usually do not.

But there are some downsides to snapshot tests as well:

- They are tightly coupled to every detail of the output of the component. This means that tests will fail if anything in the output changes. For example, even a simple copy change will cause the tests to fail. By contrast, when you write a custom component test, you assert the essential functionality: for example, that the user's name is displayed somewhere on the page.
- Snapshot tests refer to a snapshot of the component tree, not a snapshot of the screen. This means that they don't ensure that the visuals remain the same, and they will fail when there are component changes that don't affect the visuals.
- Snapshot tests make writing tests quicker, but this happens at the expense of recording intent into the test. This means that when you review a diff, you need to understand the changes and decide if they match the intent of the component. This is one sense in which traditional tests serve as documentation: they describe to future developers how the component is intended to work.
- Snapshot tests cannot be used in a Test-Driven Development style, so they don't provide the benefits of design feedback and providing a definition of done.

In place of snapshot testing, I recommend using [end-to-end tests](/e2e/intro) and [component tests](/component/intro) to confirm important functionality of your application.

## Learning More

- [The Case Against React Snapshot Testing](https://engineering.ezcater.com/the-case-against-react-snapshot-testing), blog post
