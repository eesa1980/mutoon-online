const { createFilePath } = require("gatsby-source-filesystem");
const path = require(`path`);
const orderBy = require("lodash/orderBy");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Categories @Infer {
      name: String
    }


    type wordpress__wp_media implements Node @Infer {
      url: String
      alt: String
      media_type: String
      alt_text: String
      title: String
    }
  `;

  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions;

  const categories = await graphql(`
    query {
      allWordpressCategory {
        edges {
          node {
            name
            wordpress_parent
            slug
            wordpress_id
          }
        }
      }
    }
  `);

  const books = await graphql(`
    query {
      allWordpressWpBooks {
        edges {
          node {
            wordpress_id
            acf {
              arabic
              english
              book_title
              cover_image {
                alt
                url
              }
              page_number
            }
            slug
            categories {
              slug
            }
          }
        }
      }
    }
  `);

  categories.data.allWordpressCategory.edges.forEach((edge) => {
    const book = books.data.allWordpressWpBooks.edges
      .filter((bookEdge) => bookEdge.node.categories[0].slug === edge.node.slug)
      .map((item) => item.node);

    const ordered = orderBy(book, "acf.page_number", "asc");

    createPage({
      path: edge.node.slug,
      component: path.resolve(`./src/templates/Book.tsx`),
      context: { title: edge.node.name, book: ordered },
    });
  });
};
