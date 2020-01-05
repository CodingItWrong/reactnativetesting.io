---
title: GitHub Actions
---

# Testing on GitHub Actions

To run unit, component, and iOS end-to-end tests on GitHub Actions, create a `.github/workflows` folder add the following `test.yml` file to it:

```yml
name: Test
on: [push]

jobs:
  build:
    name: Test
    runs-on: macOS-latest
    steps:
      - uses: actions/checkout@v1
      - name: Set up Node
        run: |
          npm install -g react-native-cli
          npm install -g detox-cli
          npm install -g yarn
      - name: Install Detox
        run: |
          brew tap wix/brew
          brew install applesimutils
      - name: Install Yarn Dependencies
        run: yarn install
      - name: Unit Tests
        run: yarn test
      - name: Install Pod Dependencies
        run: cd ./ios && pod install && cd ..
      - name: Detox Build
        run: detox build --configuration ios.sim.release
      - name: Detox Test
        run: detox test --configuration ios.sim.release --cleanup
```

Your workflow run will be visible in the Actions tab of your GitHub repository.

## Reference

- [GitHub Actions - Configuring a workflow](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow)
