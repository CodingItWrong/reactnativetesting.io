---
title: External Services
sidebar_position: 4
---
import Chat from '../_chat.mdx'

# E2E Testing with External Services

**Generally it's better not to hit external services in end-to-end tests**, even external services you own. Instead, **create a fake version of the external services for your tests.** We'll see how to do this below.

It seems like hitting external services would give you more confidence, and that using fake services isn't really testing your app. But hitting external services opens your tests up to flakiness due to network unreliability and outages in different systems--especially if the services aren't owned by you. Also, setting up test data against a real external service can make your tests much harder to write and maintain, making it less likely that you'll write and maintain them.

So how can you gain confidence that your app works against the real service? Here's what I'd recommend, in order of preference:

1. You are almost certainly doing *some* manual testing your app. Let that manual testing be the test that the external service connectivity works.
2. If you feel the need to automate testing of the external service connection, write just one or a few tests as part of a separate test suite. That way you can run it whenever you like, but it won't cause CI failures. Keep your main test suite using a fake external service.

## Faking External Services

We don't need to rely on any special libraries to fake external connections; it's easy to write ourselves. As an additional benefit, this approach nudges our app to be less coupled to specifics of third-party libraries. Let's see how.

Say our app has an `api.js` file that configures an instance of [Axios][axios], a popular HTTP client:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sample-api-url.reactnativetesting.io/',
});

export default api;
```

This file is required throughout our app. For example, here's a component where we do a GET request to load widgets:

```jsx
import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import api from './api';

export default function WidgetContainer() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    api.get('/widgets').then(response => {
      setWidgets(response.data);
    });
  }, []);

  //...
}
```

How can we fake out this client? We'll do this by creating another module that exposes the same interface as `api.js`, but is implemented using hard-coded in-memory data instead of web service calls. Then we'll configure our app to use this fake module when running our Detox tests.

First let's create the fake; then we'll work on wiring it up. In the same folder as `api.js`, make an `api.mock.js` file. Add the following:

```js
const api = {
  get() {
    return Promise.resolve();
  },
};

export default api;
```

We create an object with the same interface as an Axios instance as we are using it: it has a `get()` method that returns a `Promise`.

Now let's add some fake data to it:

```diff
 const api = {
   get() {
-    return Promise.resolve();
+    return Promise.resolve({
+      data: [
+        {id: 1, name: 'Widget 1'},
+        {id: 2, name: 'Widget 2'},
+      ],
+    });
   },
 };

 export default api;
```

Now if we hook up this fake service it will return hard-coded data instead of hitting a web service. If your app makes `post()` or `patch()` requests you can add methods for those. If there are several different `get()` requests sent throughout your app, you can check the arguments passed to `get()` to decide which hard-coded data to send back. You can even add statefulness, storing an array of records in `api.mock.js`, appending to it when data is `post()`ed, etc.

Next, how can we hook our fake up to our app? We need some way to use our real service in development and production, but our fake service when end-to-end testing.

[Detox's documentation on mocking](https://wix.github.io/Detox/docs/guide/mocking) recommends customizing Metro bundler to use `.mock.js` files when a certain flag is set. We'll do this by customizing `metro.config.js`.

React Native CLI projects should have a `metro.config.js` file at the root of the project. By default it contains the following, although you may have added some customizations:

```js
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

Expo projects might not have a `metro.config.js` file. If not, run the following:

```bash
$ npx expo customize metro.config.js
```

This will add a simple `metro.config.js` file to the root of your project with the following contents:

```js
// Learn more https://docs.expo.io/guides/customizing-metro
const {getDefaultConfig} = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
```

Before we start, add an object-spread to give us an object to add customizations to:

```diff
-module.exports = getDefaultConfig(__dirname);
+module.exports = {
+  ...getDefaultConfig(__dirname),
+};
```

Now, whether you're using React Native CLI or Expo, add the following `resolver` key to the exported object:

```diff
+const defaultSourceExts =
+  require('metro-config/src/defaults/defaults').sourceExts;
+
 module.exports = {
   //...
+  resolver: {
+    sourceExts:
+      process.env.MOCK_API === 'true'
+        ? ['mock.js', ...defaultSourceExts]
+        : defaultSourceExts,
+  },
 }
```

`sourceExts` allows us to configure which file extensions Metro bundler users when importing modules. In our case, if a `MOCK_ENV` environment variable is set to `'true'`, we add `'mock.js'` to the front of the list, so that if a `.mock.js` file is present it will be preferred. If `MOCK_ENV` is not set to `'true'`, we use the default `sourceExts` config, so `.mock.js` files will be ignored. This will allow us to run our app with our without mocks.

When running your app, mocking will be off by default. How can we sure it runs when we run the app?

## Mocking Debug Mode

First, if you're using React Native CLI, let's set up a way to use mocks in debug mode. This might be your common workflow while writing your Detox tests locally. When running in debug mode, your app will load its JavaScript bundle from a running Metro bundler server. So, we can add a `package.json` command to pass the `MOCK_ENV=true` flag to Metro:

```diff
 "start": "react-native start",
+"start:mock": "MOCK_API=true npm run start",
 "test": "jest"
```

(If your need to support development on Windows machines, use the [cross-env](https://github.com/kentcdodds/cross-env) package as part of this command.)

Start Metro using this new command:

```bash
$ yarn start:mock
```

Now, when you run your app for development you should see the mocked data. It will also be used when running your Detox test:

```bash
$ detox test -c ios.sim.debug
```

## Mocking Release Mode

Now, how about release mode? This might be your common workflow when running your Detox tests on CI, and it's also the only way I've gotten Detox working with Expo.

In release mode, the Metro bundler runs when we build our app, so we want to ensure the `MOCK_API=true` environment variable is set at that time. We can do that by prepending `export MOCK_API=true &&` to our build command in `.detoxrc.js`.

Here's the change for React Native CLI:

```diff
 'ios.release': {
   type: 'ios.app',
   binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/MyCoolApp.app',
-  build: 'xcodebuild -workspace ios/MyCoolApp.xcworkspace -scheme MyCoolApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
+  build: 'export MOCK_API=true && xcodebuild -workspace ios/MyCoolApp.xcworkspace -scheme MyCoolApp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
 },
```

And here it is for Expo:

```diff
 'ios.release': {
   type: 'ios.app',
   binaryPath: 'expotestingsandbox.app',
-  build: 'eas build --local --profile development-detox --platform ios && tar -xvzf build-*.tar.gz && rm build-*.tar.gz'
+  build: 'export MOCK_API=true && eas build --local --profile development-detox --platform ios && tar -xvzf build-*.tar.gz && rm build-*.tar.gz'
 },
```

After making this change, build and run your release tests again:

```bash
$ detox build -c ios.sim.release
$ detox test -c ios.sim.release
```

You should see your mocked data being used.

<Chat />

[axios]: https://github.com/axios/axios
