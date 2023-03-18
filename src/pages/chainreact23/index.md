---
title: "Testing React Native Apps - Chain React 2023"
---

import Header from './_header.mdx'
import Contact from './_contact.mdx'

<Header />

May 17, 2022, full day

## Pre-Workshop Setup

Thank you for signing up for the workshop! Here are the steps you can go through in advance to ensure your local development environment is ready.

## Requirements

Follow the instructions in React Native's [Setting up the development environment](https://reactnative.dev/docs/environment-setup) for "React Native CLI Quickstart". This should include setting up:

- [Node](https://nodejs.org)
- [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)
- [Ruby](https://www.ruby-lang.org/)
- [Cocoapods](https://cocoapods.org/)
- [Android Studio](https://developer.android.com/studio) and/or [Xcode](https://developer.apple.com/xcode/)

## Setting Up the Repo

We will be adding tests to a pre-existing exercise GitHub repo, [rn-testing-exercises](https://github.com/CodingItWrong/rn-testing-exercises).

Clone the repo locally:

```bash
git clone https://github.com/CodingItWrong/rn-testing-exercises.git
```

Install the dependencies:

```bash
$ cd rn-testing-exercises
$ yarn install
$ npx pod-install
```

Get an API key:

- Go to <https://api.outsidein.dev> and click the "Create API Key" button. A personal API key will be created for you and shown to you.
- Copy the API key. Open the file `src/api.js` and replace the value of the `API_KEY` variable with the API key.

## Trying It Out

Do the following to make sure your local installation is working:

- Run `yarn test`. You should see output like the following, including "Tests: 1 todo, 1 total":

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

- Run `yarn start`. You should see the following prompt (maybe with some warnings after it):

```
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

## You're Ready!

If you reached this point and were able to see both the test output and the running app, congratulations: you are ready for the workshop! On Wednesday, May 17th in the workshop we will take it from here. See you then!

<Contact />
