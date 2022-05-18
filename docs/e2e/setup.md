---
title: Setting Up Detox
sidebar_position: 2
---
import Chat from '../_chat.mdx'

# Setting Up Detox

These instructions will cover setting up Detox with React Native CLI. [Detox does not officially support Expo](https://github.com/wix/Detox/blob/master/docs/Guide.Expo.md).

## Installing Detox

First, let's install the global Detox CLI tool:

```bash
$ xcode-select --install
$ brew tap wix/brew
$ brew install applesimutils
$ npm install -g detox-cli
```

Next, we need to add Detox as a dependency to our project.

```bash
$ yarn add --dev detox
```

Now, initialize Detox in your app to get some config files set up. We specify that we'll be using Jest as the test runner. If you're using Mocha in place of Jest, Detox can also be used with Mocha instead.

```bash
$ detox init -r jest
```

This creates several files, including `.detoxrc.json`.

After this, we need to add some extra config to `.detoxrc.json`. Add the following, replacing `YourAppName` with the name of the app you entered:

```diff
 {
   "testRunner": "jest",
   "runnerConfig": "e2e/config.json",
   "skipLegacyWorkersInjection": true,
   "apps": {
     "ios": {
       "type": "ios.simulator",
-      "binaryPath": "SPECIFY_PATH_TO_YOUR_APP_BINARY",
+      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/YourAppName.app",
+      "build": "xcodebuild -workspace ios/YourAppName.xcworkspace -scheme YourAppName -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
     },
     "android": {
       "type": "android.apk",
       "binaryPath": "SPECIFY_PATH_TO_YOUR_APP_BINARY"
     }
   },
   ...
 }
```

## Configuring ESLint

If you're using ESLint (and you probably should be!), here are steps to set it up to recognize Detox code.

```bash
$ yarn add --dev eslint-plugin-detox
```

Then add the detox plugin and environment to your ESLint config:

```diff
 module.exports = {
   root: true,
   extends: '@react-native-community',
+  plugins: ['detox'],
+  overrides: [
+    {
+      files: ['*.e2e.js'],
+      env: {
+        'detox/detox': true,
+        jest: true,
+        'jest/globals': true,
+      },
+    },
+  ],
 };
```

## Smoke Test

Detox installs a sample test for you that you can tweak. If you are installing Detox into a brand-new React Native app, you can make a passing test doing the following.

First, add a `Text` component with a `testID` prop in `App.js` so Detox can find it:

```diff
 <View
   style={{
     backgroundColor: isDarkMode ? Colors.black : Colors.white,
   }}>
+  <Text testID="hello">Hello, Detox!</Text>
   <Section title="Step One">
```

Then open the `e2e/firstTest.e2e.js` that `detox init` generated. Replace the contents with the following:

```javascript
describe('App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the hello message', async () => {
    await expect(element(by.id('hello'))).toBeVisible();
  });
});
```

To run this test, start the Metro bundler as usual:

```bash
$ yarn start
```

In another terminal window, build the Detox version of the binary, and run the tests:

```bash
$ detox build -c ios
$ detox test -c ios
```

You should see the following output:

```bash
detox[5950] INFO:  App: should show the step one message
detox[5950] INFO:  App: should show the step one message [OK]

 PASS  e2e/firstTest.e2e.js (12.943s)
  App
    ✓ should show the steps (1813ms)
```

<Chat />
