module.exports = {
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  siteMetadata: {
    title: "Mutoon Online",
    titleTemplate: "%s · Mutoon Online Memorisation Tool",
    description:
      "A tool to help with memorsation of some important Islamic texts.",
    url: "mutoon-online.app", // No trailing slash allowed!
    image: "/images/logo.jpg", // Path to your image you placed in the 'static' folder
    twitterUsername: "@mutoon_online",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/images/logo.png",

        // WebApp Manifest Configuration
        appDescription:
          "A tool to help with memorsation of some important Islamic texts.",
        developerName: "eesa1980",
        developerURL: "https://github.com/eesa1980",
        background: "#303030",
        theme_color: "#009688",
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          yandex: false,
          windows: false,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `teal`,
      },
    },
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        // [required] - path to your createStore module
        pathToCreateStoreModule: "./src/redux/state/createStore.js",
        // [optional] - options passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        // will be merged with these defaults:
        serialize: {
          space: 0,
          isJSON: true,
          unsafe: false,
        },
        // [optional] - if true will clean up after itself on the client, default:
        cleanupOnClient: true,
        // [optional] - name of key on `window` where serialized state will be stored, default:
        windowKey: "__PRELOADED_STATE__",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mutoon Online`,
        short_name: `Mutoon`,
        start_url: `/`,
        background_color: `#303030`,
        theme_color: `#009688`,
        display: `standalone`,
        logo: "./src/images/logo.png",
        cache_busting_mode: "none",
        legacy: false, // this will not add apple-touch-icon links to <head>
        theme_color_in_head: false, // This will avoid adding theme-color meta tag.
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        appendScript: require.resolve(`./src/sw-range-request-handler.js`),
        precachePages: [`/`, `/*`],
        options: {
          workboxConfig: {
            globPatterns: ["**/*"],
          },
        },
      },
    },
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
  ],
};
