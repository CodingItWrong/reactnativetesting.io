---
title: External Services
---

# E2E Testing with External Services

**Generally it's better not to hit external services in end-to-end tests**, even external services you own. Instead, **create a fake version of the external services for your tests.** We'll see how to do this below.

It seems like hitting external services would give you more confidence, and that using fake services isn't really testing your app. But hitting external services opens your tests up to flakiness due to network unreliability and outages in different systems--especially if the services aren't owned by you. Also, setting up test data against a real external service can make your tests much harder to write and maintain, making it less likely that you'll write and maintain them.

So how can you gain confidence that your app works against the real service? Here's what I'd recommend, from preferred first:

1. You are almost certainly doing *some* manual testing your app. Let that manual testing be the test that the external service connectivity works.
2. If you feel the need to automate testing of the external service connection, write just one or a few tests as part of a separate test suite. That way you can run it whenever you like, but it won't cause CI failures. Keep your main test suite using a fake external service.

## Faking External Services

We don't need to rely on any special libraries to fake external connections; it's easy to write ourselves. As an additional benefit, this approach nudges our app to be less coupled to specifics of third-party libraries. Let's see how.

Say our app has an `api.js` file that configures an instance of [Axios][axios], a popular HTTP client:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.reactnativetesting.io/',
});

export default api;
```

This file is required throughout our app. For example, here's a component where we do a GET request to load widgets:

```jsx
import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import api from './api';

const WidgetContainer = () => {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    api.get('/widgets').then(response => {
      setWidgets(response.data);
    });
  }, []);

  //...
};
```

How can we fake out this client? We just create another module that exposes the same interface to the rest of the app, but uses hard-coded in-memory data instead. Let's see how.

First let's create a fake, then wire it up. Make an `api` folder and create a `fake.js` in it. Add the following:

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

OK, now if we hook up this fake service it will return hard-coded data instead of hitting a web service. If your app makes `post()` or `patch()` requests you can add methods for those. If there are several different `get()` requests sent throughout your app, you can check the passed-in URL to decide which hard-coded data to send back. You can even add statefulness, storing an array of records in `fake.js`, appending to it when data is `post()`ed, etc.

Next, how can we hook our fake up to our app? We need some way to use our real service during development and production, but our fake service during testing. Let's set up the plumbing for that first, then figure out how to set that flag.

Move `api.js` into the api folder and rename it to `remote.js`. Now in api create an `index.js` in it. Metro Bundler handles index files the way many other bundlers do: the import path `./api` will match either `./api.js` or `./api/index.js`. This means you don't even need to make changes to the import statements in the rest of your app; you can just expand the one `api.js` file into a directory.

In `api/index.js`, add the following:

```js
import fake from './fake';
import remote from './remote';

const apiDriver = 'fake';
let api;

switch (apiDriver) {
  case 'remote':
    api = remote;
    break;
  case 'fake':
    api = fake;
    break;
}

export default api;
```

If the driver variable is set to "remote" we export the real Axios client; if it's set to "fake" we export the fake one.

Now, how can we switch without having to edit this file? A package called `react-native-config` will help us set config values.

## react-native-config

Install `react-native-config`:

```sh
$ yarn add react-native-config
$ (cd ios; pod install)
```

Create an `.env` file at the root of your project:

```sh
API_DRIVER=remote
```

And an `.env.detox` file:

```sh
API_DRIVER=fake
```

Now update your `api/index.js` file to read the config value:

```diff
+import env from 'react-native-config';
 import fake from './fake';
 import remote from './remote';

-const apiDriver = 'fake';
+const apiDriver = env.API_DRIVER;
 let api;

 switch (apiDriver) {
   case 'remote':
     api = remote;
     break;
   case 'fake':
     api = fake;
     break;
 }

 export default api;
```

When running your app, the `.env` file will be used by default, which will load the real API client. We can update the detox command to tell it to load `.env.detox` instead by adding `ENVFILE=.env.detox` to the front of the detox `build` config property in `.detoxrc.json`:

```diff
 "configurations": {
   "ios": {
     "type": "ios.simulator",
     "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/RNTestingSandbox.app",
-    "build": "xcodebuild -workspace ios/RNTestingSandbox.xcworkspace -scheme RNTestingSandbox -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
+    "build": "ENVFILE=.env.detox xcodebuild -workspace ios/RNTestingSandbox.xcworkspace -scheme RNTestingSandbox -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
     "device": {
       "type": "iPhone 11"
     }
   },
```

Note that, unlike JS files, you can't just reload the app when you change a `.env` file; you need to rebuild the app:

```bash
$ detox build -c ios
$ detox test -c ios
```

[axios]: https://github.com/axios/axios
[react-native-config]: https://github.com/luggit/react-native-config
