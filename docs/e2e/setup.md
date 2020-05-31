---
title: Setting Up Detox
---

# Setting Up Detox

These instructions will cover setting up Detox with React Native CLI. [Detox does not officially support Expo](https://github.com/wix/Detox/blob/master/docs/Guide.Expo.md).

## Installing Detox

First, let's install the global Detox CLI tool:

```bash
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
   "configurations": {
     "ios": {
       "type": "ios.simulator",
-      "binaryPath": "SPECIFY_PATH_TO_YOUR_APP_BINARY",
+      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/YourAppName.app",
+      "build": "xcodebuild -workspace ios/YourAppName.xcworkspace -scheme YourAppName -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
       "device": {
         "type": "iPhone 11"
       }
     },
     "android": {
       "type": "android.emulator",
       "binaryPath": "SPECIFY_PATH_TO_YOUR_APP_BINARY",
       "device": {
         "avdName": "Pixel_2_API_29"
       }
     }
   }
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
+  env: {
+    'detox/detox': true,
+  },
 };
```

## Smoke Test

Detox installs a sample test for you that you can tweak. If you are installing Detox into a brand-new React Native app, you can make a passing test doing the following.

First, add a `testID` prop to an element in `App.js` so Detox can find it:

```diff
   render() {
     return (
       <View style={styles.container}>
-        <Text style={styles.welcome}>
+        <Text style={styles.welcome} testID="welcome">
           Welcome to React Native!
         </Text>
```

Then open the `firstTest.spec.js` that `detox init` generated. Replace the contents with the following:

```javascript
describe('App', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the welcome message', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
```

To run this test, start the Metro packager as usual:

```bash
$ react-native start
```

In another terminal window, build the Detox version of the binary, and run the tests:

```bash
$ detox build
$ detox test
```

You should see the following output:

```bash
detox[87254] INFO:  [DetoxServer.js] server listening on localhost:63646...
detox[87254] INFO:  [AppleSimUtils.js] org.reactjs.native.example.CLIJestTest launched. The stdout and stderr logs were recreated, you can watch them with:
        tail -F /Users/josh/Library/Developer/CoreSimulator/Devices/638CF558-A2B2-4C27-9C8D-7DB5E348E5D8/data/tmp/detox.last_launch_app_log.{out,err}
 PASS  e2e/firstTest.spec.js (13.513s)
  App

    ✓ should show the welcome message (930ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        13.646s, estimated 55s
Ran all test suites matching /e2e/i with tests matching "^((?!:android:).)*$".
```
