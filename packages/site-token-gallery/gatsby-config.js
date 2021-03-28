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

    // generate robots.txt
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: { policy: [{ userAgent: '*', allow: '/' }] },
    },

    // // source generated data from token manifest
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: { path: `./node_modules/@bvalosek/token-manifest/data` },
    // },

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

    // resolve remote images
    // {
    //   resolve: `gatsby-plugin-remote-images`,
    //   options: {
    //     nodeType: 'TokensJsonMetadataContent',
    //     imagePath: 'image',
    //     prepareUrl: (url) => url.replace('ipfs://', 'https://gateway.pinata.cloud/'),
    //   },
    // },

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
