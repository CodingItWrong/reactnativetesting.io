module.exports = {
  title: 'ReactNativeTesting.io',
  description: 'Learn how to test your React Native app with a combination of unit, component, and end-to-end tests.',
  plugins: [
    ['@vuepress/google-analytics', {
      ga: 'UA-122337453-1',
    }],
  ],
  themeConfig: {
    sidebar: [
      {
        title: 'Unit Tests',
        children: [
          '/unit/intro',
          '/unit/setup',
          '/unit/testing',
          '/unit/learning-more',
        ],
      },
      {
        title: 'Component Tests',
        children: [
          '/component/intro',
          '/component/setup',
          '/component/testing',
          '/component/effects-and-external-services',
          '/component/learning-more',
        ],
      },
      {
        title: 'End-to-End Tests',
        children: [
          '/e2e/intro',
          '/e2e/setup',
          '/e2e/testing',
          '/e2e/external-services',
          '/e2e/learning-more',
        ],
      },
      {
        title: 'Continuous Integration',
        children: [
          '/ci/intro',
          '/ci/github-actions',
          '/ci/travis-ci',
          '/ci/circleci',
        ],
      },
      {
        title: 'More Resources',
        children: [
          '/resources/test-pyramid',
          '/resources/snapshot-tests',
        ],
      },
    ],
  },
};
