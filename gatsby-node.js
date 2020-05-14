const { createFilePath } = require("gatsby-source-filesystem");
const path = require(`path`);
const orderBy = require("lodash/orderBy");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `

    type wordpress__wp_media implements Node @Infer {
      url: String
      alt: String
      media_type: String
      alt_text: String
      title: String
    }

    type wordpress__CATEGORY implements Node @Infer {
      offsets: String
    }
  `;

  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions;

  const books = await graphql(`
    query {
      allWordpressWpBooks {
        group(field: acf___book_title) {
          nodes {
            wordpress_id
            acf {
              arabic
              english
              book_title
              page_number
              audio {
                localFile {
                  publicURL
                }
              }
            }
            slug
            categories {
              acf {
                audio_file {
                  localFile {
                    publicURL
                  }
                }
                offsets
              }
              slug
              name
            }
          }
        }
      }
    }
  `);

  books.data.allWordpressWpBooks.group.forEach((group) => {
    const nodes = group.nodes.map((node) => {
      node.acf.page_number = parseInt(node.acf.page_number);
      return node;
    });

    const ordered = orderBy(nodes, "acf.page_number", "asc");

    const { name, acf } = ordered[0].categories[0];

    createPage({
      path: ordered[0].categories[0].slug,
      component: path.resolve(`./src/templates/Book.tsx`),
      context: {
        title: name,
        offsets: JSON.parse(acf.offsets),
        book: ordered,
        audio_file:
          (acf.audio_file && acf.audio_file.localFile.publicURL) || "",
      },
    });
  });
};
