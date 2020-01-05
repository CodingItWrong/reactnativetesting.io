---
title: CircleCI
---

# Testing on CircleCI

To run unit, component, and iOS end-to-end tests on CircleCI, follow the [CircleCI Getting Started guide](https://circleci.com/docs/2.0/first-steps/#section=getting-started). When you get to the point that it instructs you to add a `config.yml` file to the `.circleci` folder, give it the following contents:

```yml
version: 2
jobs:
  build:
    macos:
      xcode: "11.3.0"

    working_directory: ~/repo

    steps:
      - checkout

      # Set up environment
      - run: npm install -g react-native-cli
      - run: npm install -g detox-cli
      - run: brew tap wix/brew
      - run: brew install applesimutils

      # run unit tests
      - run: yarn install
      - run: yarn test

      # run E2E tests
      - run: cd ios && pod install && cd ..
      - run: detox build --configuration ios.sim.release
      - run: detox test --configuration ios.sim.release --cleanup
```


## Reference

- [CircleCI Documentation](https://circleci.com/docs/2.0/)
