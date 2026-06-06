/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'LogicBuy — Buy by Specs, Not by Brands',
  author: 'LogicBuy Expert Team',
  headerTitle: 'LogicBuy',
  description:
    'The global knowledge base for spec-driven, brand-free consumer decisions. Smart Decisions, Zero BS.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://logicbuy.guide',
  siteRepo: 'https://github.com/lymlililala/logicbuy',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: 'hello@logicbuy.guide',
  github: 'https://github.com/lymlililala/logicbuy',
  x: 'https://twitter.com/logicbuyguide',
  linkedin: 'https://www.linkedin.com/company/logicbuy',
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
