---
title: Intro to Continuous Integration
---

# Continuous Integration

"Continuous Integration" (CI) is a term that's been used in a few different ways. In general it refers to "integrating" your code changes into the main branch of code on an ongoing basis.

Specifically, CI services help you to integrate your changes frequently by automating test, build, and release processes for you. For our purposes, we will work on setting up automated tests to run on pull requests. You can also use CI to automatically build your app and send the build to TestFlight, App Center, or other deployment services.

## Android Support

Getting Android emulators running on CI services is challenging, so for now this site only documents how to get End-to-End tests running for iOS. Unit and component tests run fine regardless of which mobile platform your app deploys to.

## Release Build

If you followed the end-to-end test instructions on this site you set up an `ios.sim.debug` configuration for Detox. To run end-to-end tests on CI, it's best to add a separate `ios.sim.release` configuration. Add the following to `package.json`, replacing `YourAppName` with the name of the app you entered:

```diff
 "detox": {
   "test-runner": "jest",
   "configurations": {
     "ios.sim.debug": {
...
+    },
+    "ios.sim.release": {
+      "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/YourAppName.app",
+      "build": "xcodebuild -workspace ios/YourAppName.xcworkspace -scheme YourAppName -configuration Release -sdk iphonesimulator -derivedDataPath ios/build",
+      "type": "ios.simulator",
+      "device": {
+        "type": "iPhone 11 Pro"
+      }
+    },
   }
```

After this, when running Detox commands locally, instead of just `detox build` and `detox test` you'll need to specify the configuration:

```sh
$ detox build -c ios.sim.debug
$ detox test -c ios.sim.debug
```

## CI Service Options

A few popular CI services for React Native are:

- [GitHub Actions](/ci/github-actions) - macOS builds are available on the free tier.
- [Travis CI](/ci/travis-ci) - Free builds for open source projects, including access to macOS. For closed source, the lowest plan is $63/month.
- [CircleCI](/ci/circleci) - To get macOS builds for E2E tests, need at least the $30/month plan.
