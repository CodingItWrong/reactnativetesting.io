---
title: "Testing React Native Apps - Chain React 2023"
---

import Header from './_header.mdx'
import Contact from './_contact.mdx'

<Header />

May 17, 2023, full day

## Pre-Workshop Setup

Thank you for signing up for the workshop! Here are the steps you can go through in advance to ensure your local development environment is ready.

Feel free to chat during the workshop at [Infinite Red Slack](https://community.infinite.red/) in the `#chain-react-testing-workshop-2023` room

## Requirements

Follow the instructions in React Native's [Setting up the development environment](https://reactnative.dev/docs/environment-setup) for "React Native CLI Quickstart". This should include setting up:

- [Node](https://nodejs.org)
- [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)
- [Ruby](https://www.ruby-lang.org/)
- [Cocoapods](https://cocoapods.org/)
- [Android Studio](https://developer.android.com/studio) and/or [Xcode](https://developer.apple.com/xcode/)
- [detox-cli](https://wix.github.io/Detox/docs/introduction/getting-started/#detox-prerequisites) and related dependencies

## Setting Up the Repo

We will be adding tests to a pre-existing exercise GitHub repo, [rn-testing-exercises](https://github.com/CodingItWrong/rn-testing-exercises).

Clone the repo locally:

```bash
git clone https://github.com/CodingItWrong/rn-testing-exercises.git
```

Install the dependencies:

```bash
cd rn-testing-exercises
yarn install
npx pod-install
```

Get an API key:

- Go to <https://api.outsidein.dev> and click the "Create API Key" button. A personal API key will be created for you and shown to you.
- Copy the API key. Open the file `src/api.js` and replace the value of the `API_KEY` variable with the API key.

## Trying It Out

Do the following to make sure your local installation is working. If you run into any issues, feel free to ask for help in [my react-native-testing Discord channel](https://discord.gg/jVXCxZPF6f).

### Running the App

- Run `yarn start`. You should see the following prompt (maybe with some warnings after it):

```text
  Welcome to Metro v0.73.8
Fast - Scalable - Integrated

r - reload the app
d - open developer menu
i - run on iOS
a - run on Android
```

- Press `i` to build and run the app on an iOS Simulator, or `a` to build and run it on an Android Emulator
- If it is not working, see React Native's [Setting up the development environment](https://reactnative.dev/docs/environment-setup) page for help.
- Once the app is launched, make sure you can see the example movies "Vertigo" and "The Sound of Music" listed.
- Type in a movie title and click Save. Confirm the movie is added to the list, with a yellow icon appearing to the right of it

### Component Tests

- Run `yarn test`. You should see output like the following:

```text
 FAIL  src/MovieRow.spec.js
  MovieRow
    ✕ displays the movie name

  ● MovieRow › displays the movie name

    Replace this exception with your first test!

      1 | describe('MovieRow', () => {
      2 |   it('displays the movie name', () => {
    > 3 |     throw new Error('Replace this exception with your first test!');
        |           ^
      4 |   });
      5 |
      6 |   // add additional tests as needed to fully specify the component's behavior

      at Object.<anonymous> (src/MovieRow.spec.js:3:11)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.193 s, estimated 1 s
Ran all test suites.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### E2E Tests

- Make sure `yarn start` is running (you may have started it when running the app above)
- If you're using iOS, run `detox build -c ios.sim.debug` then `detox test -c ios.sim.debug`.
- If you're using Android, run `detox build -c android.emu.debug` then `detox test -c android.emu.debug`
  - You may get an error "Cannot boot Android Emulator with the name: 'Pixel 3a API 30'". If so, see if another emulator name is listed in the command output. If so, open `.detoxrc.js`, and update `devices.emulator.device.avdName` to that emulator name. If no emulator name is listed, [create a new AVD in Android Studio](https://developer.android.com/studio/run/managing-avds) and then rerun the `detox test -c android.emu.debug` command.

You should see output like the following:

```text
 FAIL  e2e/managing-movies.test.js (8.382 s)
  managing movies
    ✕ allows viewing and creating movies (1737 ms)

  ● managing movies › allows viewing and creating movies

    Replace this exception with your first test!

       9 |
      10 |   it('allows viewing and creating movies', async () => {
    > 11 |     throw new Error('Replace this exception with your first test!');
         |           ^
      12 |   });
      13 | });
      14 |

      at Object.<anonymous> (e2e/managing-movies.test.js:11:11)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:27:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:19:12)

07:54:49.038 detox[32840] E Command failed with exit code = 1:
jest --config e2e/jest.config.js
```

## You're Ready!

If you reached this point and were able to see both the test output and the running app, congratulations: you are ready for the workshop! On Wednesday, May 17th in the workshop we will take it from here. See you then!

<Contact />
