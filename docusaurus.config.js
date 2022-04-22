// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ReactNativeTesting.io',
  tagline:
    'Learn how to test your React Native app with a combination of unit, component, and end-to-end tests.',
  url: 'https://reactnativetesting.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  // favicon: 'img/favicon.ico',
  organizationName: 'codingitwrong', // Usually your GitHub org/user name.
  projectName: 'reactnativetesting.io', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-MQY51C1VKW',
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ReactNativeTesting.io',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'unit/intro',
            position: 'left',
            label: 'Tutorial',
          },
          {
            href: 'https://github.com/CodingItWrong/reactnativetesting.io/blob/main/README.md#contributing',
            label: 'See an issue?',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/unit/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/react-native+testing',
              },
              {
                label: 'Reactiflux',
                href: 'https://www.reactiflux.com/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Contact',
                to: 'mailto:rntesting@codingitwrong.com',
              },
            ],
          },
        ],
        copyright: `Copyright © 2018-${new Date().getFullYear()} Josh Justice`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
