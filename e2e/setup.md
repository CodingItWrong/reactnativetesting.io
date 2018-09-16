---
title: Setting Up Detox
---

First, let's install the global Detox CLI tool:

```bash
$ brew tap wix/brew
$ brew install --HEAD applesimutils
$ yarn global add detox-cli
```

Next, we need to add Detox as a dependency to our project. Detox can use either Jest or Mocha as a test runner. I recommend Mocha because it allows you to limit test runs to just one test.

```bash
$ yarn add --dev detox mocha
```

Now, initialize Detox in your app to get some config files set up. We specify that we'll be using Jest as the test runner.

```bash
$ detox init -r mocha
```

After this, we need to add some extra config for Detox to our `package.json`. Be sure to substitute your app's name for `MyAppName` everywhere it appears:

```diff
 {
   ...
   "detox": {
-    "test-runner": "mocha"
+    "test-runner": "mocha",
+    "configurations": {
+      "ios.sim.debug": {
+        "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/MyAppName.app",
+        "build": "xcodebuild -project ios/MyAppName.xcodeproj -scheme MyAppName -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
+        "type": "ios.simulator",
+        "name": "iPhone 8"
+      }
+    }
  }
}
```

## Setting Up Linting

If you're using ESLint (and you probably should be!), here are steps to set it up to recognize Detox code.

```bash
$ yarn add --dev eslint-plugin-detox
```

Then add the detox plugin and environment to your ESLint config:

```diff
 module.exports = {
   extends: 'airbnb',
+  plugins: [
+    'detox',
+  ],
+  env: {
+    'detox/detox': true,
+  },
...
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

In another terminal window, run the detox tests with:

```bash
$ detox test
```

You should see the following output:

```bash
$ detox test
node_modules/.bin/mocha e2e --opts e2e/mocha.opts --configuration ios.sim.debug     --grep :android: --invert     --artifacts-location "artifacts/ios.sim.debug.2018-08-03 11:09:13Z"

*snip*

Example
  ✓ should show the welcome message (264ms)


1 passing (1m)
```
