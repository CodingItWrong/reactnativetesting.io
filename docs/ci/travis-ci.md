---
title: Travis CI
---

# Testing on Travis CI

To run unit, component, and iOS end-to-end tests on Travis CI, follow the [Travis CI Getting Started guide](https://docs.travis-ci.com/user/tutorial/). When you get to the point that it instructs you to add a `.travis.yml` file to the root of your project, give it the following contents:

```yml
env:
  global:
  - NODE_VERSION=stable

install:
- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
- export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
- nvm install $NODE_VERSION
- nvm use $NODE_VERSION
- nvm alias default $NODE_VERSION

- npm install -g react-native-cli
- npm install -g detox-cli
- npm install -g yarn

matrix:
  include:
    - os: osx
      osx_image: xcode11.3
      language: objective-c
      before_install:
        - brew tap wix/brew
        - brew install applesimutils
      script:
        - yarn install
        - yarn test
        - cd ios
        - pod install
        - cd ..
        - detox build --configuration ios.sim.release
        - detox test --configuration ios.sim.release --cleanup
```

## Reference

- [Travis CI Documentation](https://docs.travis-ci.com/)
