---
title: Intro to Continuous Integration
---

# Continuous Integration

"Continuous Integration" (CI) is a term that's been used in a few different ways. In general it refers to "integrating" your code changes into the main branch of code on an ongoing basis.

Specifically, CI services help you to integrate your changes frequently by automating test, build, and release processes for you. For our purposes, we will work on setting up automated tests to run on pull requests. You can also use CI to automatically build your app and send the build to TestFlight, App Center, or other deployment services.

## Android Support

Getting Android emulators running on CI services is challenging, so for now this site only documents how to get End-to-End tests running for iOS. Unit and component tests run fine regardless of which mobile platform your app deploys to.

## CI Service Options

A few popular CI services that support React Native are:

- [GitHub Actions](/ci/github-actions) - macOS builds are available on the free tier.
- [Travis CI](/ci/travis-ci) - Free builds for open source projects, including access to macOS. For closed source, the lowest plan is $63/month.
- [CircleCI](/ci/circleci) - To get macOS builds for E2E tests, need at least the $30/month plan.
