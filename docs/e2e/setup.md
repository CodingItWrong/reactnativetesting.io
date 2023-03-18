---
title: Setting Up Detox
sidebar_position: 2
---
import Chat from '../_chat.mdx'

# Setting Up Detox

These instructions will cover setting up Detox for iOS with React Native CLI and Expo.

Although [Detox does not officially support Expo](https://github.com/wix/Detox/blob/master/docs/Guide.Expo.md), it currently seems to work if you build a non-development client (e.g. the JS bundle is built-in). If this no longer works for you, or if you've found a better way to set up Expo for Detox, please [let me know!](https://github.com/CodingItWrong/reactnativetesting.io/blob/main/README.md#contributing)

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

Now, initialize Detox in your app to get some config files set up. We specify that we'll be using Jest as the test runner.

```bash
$ detox init -r jest
```

At the root of your project, this will create a `.detoxrc.js` file and `e2e` folder containing several files. We will need to do a little configuration with these.

The first change we need relates to the fact that, although our Detox tests will be written in Jest, they need to run through the `detox` CLI tool instead of the normal `jest` command. Detox's test files by default end in `*.test.js`, but files with this extension will be picked up by the normal Jest command, resulting in failures.

We can ensure our Detox tests are only run by Detox by telling Jest to skip them when run by itself. We can configure this in the `"jest"` key in `package.json`:

```diff
 {
   ...
   "jest": {
     "preset": "...",
+    "modulePathIgnorePatterns": ["e2e"]
   }
 }
```

After this, we need to add some extra config to `.detoxrc.js`. The config to add depends on whether you're using React Native CLI or Expo.

### Configuring Detox for React Native CLI

Open `.detoxrc.js`. Under `apps`, find any keys starting with "ios". In these, look for anywhere that "YOUR_APP" appears, and replace it with the name of your app. For example, if your app is named "MyCoolApp":

```diff
 apps: {
   'ios.debug': {
     type: 'ios.app',
-    binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YOUR_APP.app',
+    binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MyCoolApp.app',
-    build: 'xcodebuild -workspace ios/YOUR_APP.xcworkspace -scheme YOUR_APP -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
+    build: 'xcodebuild -workspace ios/MyCoolApp.xcworkspace -scheme MyCoolApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
   },
   'ios.release': {
     type: 'ios.app',
-    binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/YOUR_APP.app',
+    binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/MyCoolApp.app',
-    build: 'xcodebuild -workspace ios/YOUR_APP.xcworkspace -scheme YOUR_APP -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
+    build: 'xcodebuild -workspace ios/MyCoolApp.xcworkspace -scheme MyCoolApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
     },
```

### Configuring Detox for Expo

With Expo, I have not been able to get debug mode working with Detox, where the running client app (the Expo Go client or a custom development client) loads the JavaScript bundle from a running Metro server. I have only been able to get Detox working against a release-mode app, with the JavaScript bundle built-in.

Let's see how to set that up. We'll use EAS to build our Expo app.

First, make sure you have EAS CLI installed:

```bash
$ npm install --global eas-cli
```

Next, log in with your Expo account:

```bash
$ eas login
```

Then, initialize your project to work with EAS Build:

```bash
$ eas build:configure
```

Follow the prompts to set up an EAS project. When you're done, an `eas.json` file will be created.

`eas.json` includes several different build configurations by default, but we need to add another one for Detox. Open `eas.json`, find the `build` key, and add a new entry:

```js
{
  //...js
  "build": {
    //...
    "development-detox": {
      "distribution": "internal",
      "channel": "development",
      "ios": {
        "simulator": true
        // "resourceClass": "m-medium"
      }
    }
  }
}
```

This will allow us to build a version of the app that can be run on a simulator but that builds in the JavaScript bundle instead of accessing a running Metro server.

Next, open `.detoxrc.js`. Under `apps`, find the `ios.release` key. Configure it like so:

```js
{
  //...
  apps: {
    //...
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'yourappname.app',
      build: 'eas build --local --profile development-detox --platform ios && tar -xvzf build-*.tar.gz && rm build-*.tar.gz'
    }
    //...
  }
}
```

Note that `yourappname` is the name of your app, with any hyphens removed.

Here's what's going on in the `build` command:

- We use `eas build` to build the app. We pass it the `--local` flag to run the build on our local development machine. (You could also use EAS servers to run this build, but other tweaks to the configuration may be needed.)
- We tell `eas build` to use the `development-detox` profile we configured above.
- When the build command is done, it will save an archive file named `build-[timestamp].tar.gz` in the root of the project.
- After that, we use the `tar` command to expand any matching archive file we find. This will put the built `.app` file in your project root directory.
- When the unarchiving is done, we remove the `build-[timestamp].tar.gz` file.

## Configuring ESLint

Whether you're using React Native CLI or Expo, if you're using ESLint (and you probably should be!), here are steps to set it up to recognize Detox code.

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
+      files: ['e2e/**/*.test.js'],
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

First, add a `Text` component with a `testID` prop in your `App` component so Detox can find it:

```diff
 <View
   style={{
     backgroundColor: isDarkMode ? Colors.black : Colors.white,
   }}>
+  <Text testID="hello">Hello, Detox!</Text>
   <Section title="Step One">
```

Then open the `e2e/starter.test.js` file that `detox init` generated). Replace the contents with the following:

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

To run the test, the steps are slightly different for React Native CLI and Expo.

### Running the Test with React Native CLI

To run this test, start the Metro bundler as usual:

```bash
$ yarn start
```

In another terminal window, build the Detox version of the binary (you should only need to do this when native dependencies change):

```bash
$ detox build -c ios.sim.debug
```

Then, run the tests:

```bash
$ detox test -c ios.sim.debug
```

When you save changes to your code, Metro will pick them up, and they'll be available in your app the text time you run `detox test`. This allows for a fast-feedback workflow.

### Running the Test with Expo

To build and run in Expo, run these commands:

```bash
$ detox build -c ios.sim.release
$ detox test -c ios.sim.release
```

Note that the release build builds in the bundled JavaScript into the app, so if you make changes to the app JavaScript, you will need to rerun `detox build`. Unfortunately this makes for a slow development process. If I can find a way to get Detox working with Expo debug builds, I will update these instructions.

### Test Results

Whether you are using RN CLI or Expo, the test should show you the following output:

```bash
detox[5950] INFO:  App: should show the hello message
detox[5950] INFO:  App: should show the hello message [OK]

 PASS  e2e/starter.test.js (12.943s)
  App
    ✓ should show the hello message (1813ms)
```

<Chat />
