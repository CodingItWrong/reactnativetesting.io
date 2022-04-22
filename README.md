# ReactNativeTesting.io

Source code for the web site [ReactNativeTesting.io](https://reactnativetesting.io)

## Contributing

See an error? Something out of date? Have a suggestion? We'd love your input!

To contribute, [Open a GitHub Issue](https://github.com/CodingItWrong/reactnativetesting.io/issues/new), or fork the repo and open a pull request.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Copyright

(c) 2018-present Josh Justice
