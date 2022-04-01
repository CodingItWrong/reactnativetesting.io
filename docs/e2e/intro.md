---
title: Intro to End-to-End Tests
---

# End-to-End Tests

## What is End-to-End Testing?

End-to-end tests exercise your entire application the way a user would, simulating taps and checking for components on the screen.

End-to-end tests may be written and run in a wide variety of circumstances:

- They may be written by the developers working on the app, or by separate quality engineer/test automation professionals.
- They may be written while the feature functionality is being written, or after it's complete.
- They may be run on simulators/emulators or physical devices.
- They may run on pull requests and block merge if any fail, or they may run on a separate schedule and tolerate some degree of random failures.

## End-to-End Test Options for React Native

Depending on your goals, there are several different options for end-to-end testing React Native apps that you might consider.

The following notes are based on the author's experiences and assessments he has heard. Please be encouraged to do your own research to see whether or not your experience is the same.

### [Appium][appium]

Appium is a general mobile test automation framework that can be used with any mobile applications, including React Native. It is targeted at test automation engineers.

Pros:

- Runs on exactly the same app binaries that are submitted to the App/Play Store
- Can run on simulators/emulators and physical devices.
- Integrates with paid services like [Sauce Labs](https://docs.saucelabs.com/mobile-apps/automated-testing/appium/real-devices/) that provide real physical devices of a wide variety of models available online for testing.

Cons:

- Experiences some flake as a result of not having insight into the state of the running app
- Additional flake on services like Sauce Labs because of persistent state on simulators/emulators and physical devices, random notifications, etc.
- High learning curve for developers
- Does not use technologies familiar to React Native developers

Recommendation: use Appium for tests written by test automation professionals that run on a separate schedule from pull requests and do not block CI

### [Detox][detox]

Detox is a testing framework designed specifically for React Native, although it can work on other Android and iOS apps as well. It has goals of being writable by developers, runnable on CI, and reducing flake.

Pros:

- Specifically designed to integrate with React Native
- Uses Jest and JavaScript APIs familiar to React Native developers
- "Gray box testing" approach reduces flake by allowing Detox to [automatically wait](https://wix.github.io/Detox/docs/introduction/how-detox-works#how-detox-automatically-synchronizes-with-your-app) for network operations, animations, and timers to finish

Cons:

- More limited integration with physical devices and test lab services like Sauce Labs
- Getting it running on CI can be challenging
- Expo is not officially supported, only React Native CLI apps

Use Cases: recommended for React Native CLI projects for tests written by developers that run on pull requests and block CI, especially for projects that have significant native integrations

### [React Native Testing Library](/component/intro)

We previously discussed React Native Testing Library as a component testing framework. Since your `App` is just a component, in some cases you may be able to test your _entire_ app "end-to-end" in RNTL.

However, if your app includes any native code, RNTL won't be able to test all of it. For example, React Navigation includes native code, so you can't use RNTL to test navigating around your app. Instead, you can test "as end-to-end as possible" in RNTL: integrating as much of your JavaScript code as you can. A helpful concept is the idea of a "screen test": taking a screen you pass to React Navigation and testing the entire screen, mocking out only native code, not JavaScript code.

Pros:

- Compatible with Expo apps
- Faster than running native code in a real OS
- Less flaky than Appium and Detox tests because the component tree is created from scratch within each test, instead of running in the mutable state of an app and OS

Cons:

- Does not integrate with native code, and can require a significant amount of mocking out of native code to get JavaScript code to run
- Requires more manual handling of asynchrony

Use Cases: recommended for Expo projects, and React Native CLI projects that can't invest the effort to get and keep Detox running on CI.

### Manual Testing

Manual testing refers to a human using your app directly.

Pros:

- A human reviewing the app can notice subtle visual and animation issues such as drops in frame rate
- You get some amount of manual testing "for free" while trying out the app as you build it and in smoke testing before releasing a test build

Cons:

- Labor-intensive to manually retest your whole app on every PR
- Unless you're a dedicated quality analyst, it's hard to maintain the discipline to thoroughly test without accidentally missing steps or giving into the temptation to skip things that "shouldn't break"

Use Cases: recommended

## Designing a Project Approach

You don't need to choose just one end-to-end testing approach. Depending on your project, you might want to use a combination, to allow one type of test's strengths to cover for another's weaknesses.

Here are a few examples of approaches you might take.

### Personal Expo App

The author has used this approach on two hobby Expo projects used mainly by the author:

- Running on CI, blocking PR merges, written by developers, with external services mocked out:
  - React Native Testing Library "screen test" E2E tests for each screen covering all user flows (in addition to lower-level RNTL component tests and unit tests)
- Manual testing against real external services
  - By the author as the main user of the app
  - When a dependency is updated that has native code, such as React Navigation, manually test locally before merging the PR

This manual testing makes up for the limitations of RNTL because:

- The native code integration is limited to React Navigation, and it is simple enough and changes infrequently enough that it is unlikely to break
- If it does break, no money is at risk, there are few users, and the author will catch the issue while using the app and can fix it

### Large Commercial RN CLI App

On a project with multiple developers, quality engineers, and business stakeholders:

- Running on CI, blocking PR merges, written by developers, with external services mocked out:
  - React Native Testing Library "screen test" E2E tests for each screen covering the main user flows (in addition to lower-level RNTL component tests and unit tests)
  - Detox tests running on simulators/emulators for the most important flows in the app and the ones that have the most native integrations
- Running nightly, not blocking PR merges, written by quality engineers, connecting to real external services:
  - Appium tests for the most important flows in the app running on physical devices on Sauce Labs for the most common devices your users use, connecting against real external services, with results reviewed by QEs daily to see the most common failures to see if they've uncovered a bug
- Upon each test build, manual testing by quality analysts for:
  - The most important flows in the app
  - Things that can't easily be tested by automation, such as reading physical payment cards, checking paper receipts, checking data entered into legacy external systems, and evaluating animation smoothness
  - Exploratory testing to look for issues not specifically covered by a test plan, such as visual regressions

[appium]: https://appium.io
[detox]: https://wix.github.io/Detox/
