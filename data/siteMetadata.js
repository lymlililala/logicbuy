/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'PitfallFree — Buy by Specs, Not by Brands',
  author: 'PitfallFree Expert Team',
  headerTitle: 'PitfallFree',
  description:
    'The global knowledge base for spec-driven, brand-free consumer decisions. Smart Decisions, Zero BS.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://logicbuy.vercel.app',
  siteRepo: 'https://github.com/lymlililala/logicbuy',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'hello@pitfallfree.com',
  github: 'https://github.com/pitfallfree',
  x: 'https://twitter.com/pitfallfree',
  linkedin: 'https://www.linkedin.com/company/pitfallfree',
  locale: 'en-US',
  stickyNav: true,
  analytics: {
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    // provider: 'giscus',
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
