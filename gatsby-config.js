module.exports = {
  siteMetadata: {
    title: `Mutoon Online`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        webFontsConfig: {
          fonts: {
            google: [
              {
                family: `Roboto`,
                variants: [`300`, `400`, `500`]
              }
            ]
          }
        },
        stylesProvider: {
          injectFirst: true
        }
      }
    },
    `gatsby-plugin-react-helmet`,
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
    // You can have multiple instances of this plugin
    // to create pages from React components in different directories.
    //
    // The following sets up the pattern of having multiple
    // "pages" directories in your project
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `books`,
        path: `${__dirname}/src/pages/books/`
      }
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-mdx`
  ]
};
