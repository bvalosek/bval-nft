module.exports = {
  siteMetadata: {
    title: 'Brandon Valosek - @bvalosek NFT Collection',
    siteUrl: 'https://tokens.bvalosek.com',
    description: 'Crypto art and tokenization experiments created by Brandon Valosek',
  },
  plugins: [
    // bake in <head> during build
    'gatsby-plugin-react-helmet',

    // catch local links in markdown to prevent page refresh
    'gatsby-plugin-catch-links',

    // local plugin to source token info
    {
      resolve: 'gatsby-plugin-source-tokens',
    },

    // generate typescript types for the static graphql queries
    {
      resolve: 'gatsby-plugin-graphql-codegen',
    },

    // generate robots.txt
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: { policy: [{ userAgent: '*', allow: '/' }] },
    },

    // source all markdown files
    {
      resolve: `gatsby-source-filesystem`,
      options: { path: `./src/markdown` },
    },

    // source all local images
    {
      resolve: `gatsby-source-filesystem`,
      options: { path: `./src/images` },
    },

    // process JSON files
    'gatsby-transformer-json',

    // process images
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',

    // process markdown files
    {
      resolve: 'gatsby-transformer-remark',
      options: { excerpt_separator: '<!-- snip -->' },
    },

    // remove FOUC w/ material ui styles
    {
      resolve: `gatsby-plugin-material-ui`,
      options: { stylesProvider: { injectFirst: true } },
    },
  ],
};
