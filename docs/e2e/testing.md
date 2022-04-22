---
title: Testing
sidebar_position: 3
---

# Testing

## Checking for Rendered Text

Say you have a `Text` component like so:

```jsx
<Text>Hello, World!</Text>
```

You can test that it's present by looking for the element with that text:

```js
await expect(element(by.text('Hello, World!'))).toBeVisible();

// also works:
await expect(element(by.label('Hello, World!'))).toBeVisible();
```

Note that we are checking if the element is *visible*: that is, if it is not scrolled off-screen and is at least 75% opacity. Alternatively, you can expect the element `.toExist()`, but that might result in an element that a user can't interact with.

Finding an element by text can result in fragile tests that break when you change phrasing. Instead, you can give an element a `testID` that can be used for the test to look up the element. This results in more durable tests:

```jsx
<Text testID="welcome">Hello, World!</Text>
```

```js
await expect(element(by.id('welcome'))).toBeVisible();
```

## Tapping

To tap an element, find it using some matcher, then `.tap()` it:

```jsx
<Pressable testID="mybutton" onPress={() => {}}>
  <Text>Press Me</Text>
</Pressable>
```

```js
await element(by.id('mybutton')).tap();

// also work:
await element(by.text('Press Me')).tap();
await element(by.label('Press Me')).tap();
```

## Typing Into TextInputs

To type into a `TextInput`, you have a few different options. One is to `.typeText()`:

```jsx
<TextInput testID="mytextinput" ... />
```

```js
await element(by.id('mytextinput')).typeText('I typed this');
```

One thing to keep in mind with `.typeText()` is that it won't clear out any existing text in the input. If you want to clear it out, you can `.clearText()` first:

```js
await element(by.id('mytextinput')).clearText();
await element(by.id('mytextinput')).typeText('I also typed this');
```

A shortcut for doing both is to use `.replaceText()`:

```js
await element(by.id('mytextinput')).replaceText('A third thing I typed');
```
