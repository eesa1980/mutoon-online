const path = require(`path`);
const startCase = require("lodash/startCase");
const fetch = require(`node-fetch`);
const { createRemoteFileNode } = require("gatsby-source-filesystem");

const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `.env.${activeEnv}`,
});

exports.createPages = async ({ graphql, actions }) => {
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const { createPage } = actions;

  const books = await fetch(`${process.env.GATSBY_API_URL}/book`);

  const { data } = await books.json();

  data.forEach((book) => {
    const { slug, _id: id, ...others } = book;

    createPage({
      path: slug,
      component: path.resolve(`./src/templates/Book.tsx`),
      context: { id, ...others },
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Audio implements Node {
      id: String
      book_id: String
      name: String
      offset: String
      updated_at: String
      created_at: String
      src: File @link(from: "src___NODE")
    }

    type Content {
      en: String
      ar: String
    }

    type Book implements Node {
      id: String
      category_id: String
      title: String
      updated_at: String
      created_at: String
      content: [Content]
    }

    type Category implements Node {
      id: String
      description: String
      name: String
      slug: String
      updated_at: String
      created_at: String
      avatar: File @link(from: "avatar___NODE")
    }
  `);
};

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  const createNodes = async (...endpoints) => {
    for (const endpoint of endpoints) {
      const result = await fetch(`${process.env.GATSBY_API_URL}/${endpoint}`);
      const { data } = await result.json();

      data.forEach((item) => {
        const { _id: id, ...others } = item;

        createNode({
          id,
          ...others,
          parent: null,
          children: item,
          internal: {
            type: startCase(endpoint),
            contentDigest: createContentDigest(item),
          },
        });
      });
    }
  };

  await createNodes("book", "category", "audio");
};

exports.onCreateNode = async ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  const createRemoteFileNodes = async (...args) => {
    for (const item of args) {
      const [type, fieldname] = item;

      if (node.internal.type === type && node[fieldname]) {
        let fileNode = await createRemoteFileNode({
          url: node[fieldname],
          parentNodeId: node.id,
          createNode,
          createNodeId,
          cache,
          store,
        });

        if (fileNode) {
          node[`${fieldname}___NODE`] = fileNode.id;
        }
      }
    }
  };

  await createRemoteFileNodes(["Category", "avatar"], ["Audio", "src"]);
};
