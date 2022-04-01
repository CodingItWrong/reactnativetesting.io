---
title: A Note on Continuous Integration
---

# A Note on Continuous Integration

"Continuous Integration" (CI) is a term that's been used in a few different ways. In general it refers to "integrating" your code changes into the main branch of code on an ongoing basis.

Specifically, CI services help you to integrate your changes frequently by automating test, build, and release processes for you. For pull-request-based workflows, ideally you would run all your unit, component, end-to-end tests, and lint checks on each pull request. You can also use CI to automatically build your app and send the build to TestFlight, App Center, or other deployment services.

Running JavaScript tests on CI services is fairly straightforward. Unfortunately, getting Detox E2E tests working on CI services can be more challenging. Be prepared to spend some time searching online and experimenting to get them working.

## CI Service Options

A few popular CI services that some have had success with React Native include:

- [GitHub Actions](https://github.com/features/actions) - macOS builds are available on the free tier.
- [CircleCI](https://circleci.com) - To get macOS builds for E2E tests, a paid plan is required.
