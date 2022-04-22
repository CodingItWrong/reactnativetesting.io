---
title: Which Types of Test Should I Write?
sidebar_position: 1
---

# Which Types of Test Should I Write?

There are lots of different views on what combinations of types of test to use. You should try different combinations and see what works for your app. Here is a recommendation based on the advice of those who started the automated testing and test-driven development movements.

End-to-end tests give you the greatest confidence that your app is working, because they are interacting with your app the way a user is. A downside of end-to-end tests is that they're slow. If you want to thoroughly test all the possible combinations of data and user interaction in your app, the length of your test suite will get longer and longer. If the suite gets too long to run the whole suite on your local machine, you miss out on the feedback that tests provide. Also, when an end-to-end test fails, it provides little input into *why* it failed. You can see that the wrong data appeared on the screen, but you can't tell which code is responsible for this problem.

Unit and component tests have the opposite tradeoff. They don't prove your app is working for the end user; instead they prove that the individual pieces that you are plugging together work the way you expect. This allows you to test more of the edge cases at a unit and component level, and let end-to-end tests focus on the main cases: maybe the happy path and one error path. Unit and component tests are much faster, so they can better handle thoroughly testing all your edge cases. They also provide better error localization, so that when something goes wrong you can see *which* function or component failed.

# Learning More

- This view corresponds to the “test pyramid”. You can learn more about it on [Martin Fowler’s Test Pyramid page](https://martinfowler.com/bliki/TestPyramid.html).
- Learn about the testing pyramid and React Native in [Testing & React Native: Lessons from the Battlefield](https://www.youtube.com/watch?v=cUSUJXAvt6k), a talk by by Aaron Greenwald
