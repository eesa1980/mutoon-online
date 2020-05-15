import { graphql } from "gatsby";
import * as React from "react";

interface RootObject {
  allWordpressWpBooks: AllWordpressWpBooks;
  allWordpressCategory: AllWordpressCategory;
}

interface AllWordpressCategory {
  nodes: Node2[];
}

interface Node2 {
  wordpress_id: number;
  slug: string;
  wordpress_parent: number;
  name: string;
  description: string;
  acf: Acf2;
}

interface Acf2 {
  offsets: string;
}

interface AllWordpressWpBooks {
  group: Group[];
}

interface Group {
  edges: Edge[];
}

interface Edge {
  node: Node;
}

interface Node {
  categories: Category[];
  acf: Acf;
}

interface Acf {
  arabic: string;
  book_title: string;
  english: string;
  page_number: string | number;
}

interface Category {
  name: string;
  slug: string;
  wordpress_id: number;
  parent_element: Parentelement;
}

interface Parentelement {
  wordpress_id: number;
  slug: string;
}

const ComponentName = ({ data }: { data: RootObject }) => {
  const books = data.allWordpressWpBooks.group.map((item) => {
    const { name: title, slug } = item.edges[0].node.categories[0];

    return {
      [slug]: {
        category_id:
          item.edges[0].node.categories[0].parent_element.wordpress_id,
        title,
        slug: item.edges[0].node.categories[0].slug,
        content: item.edges
          .sort((first: any, second: any) => {
            return (
              parseInt(first.node.acf.page_number as string, 10) -
              parseInt(second.node.acf.page_number as string, 10)
            );
          })
          .map((book) => {
            book.node.acf.page_number = parseInt(
              book.node.acf.page_number as string,
              10
            );

            const { arabic, english } = book.node.acf;

            const re = (text: any) =>
              text.replace(/(<(p|span)[^>]+?>|<(p|span)>|<\/(p|span)>)/gim, "");

            return {
              ar: re(arabic),
              en: re(english),
            };
          }),
      },
    };
  });

  const categories = data.allWordpressCategory.nodes.map((item) => {
    const { wordpress_id, wordpress_parent, acf, name, slug, ...others } = item;
    return {
      category_id: item.wordpress_id,
      parent_id: item.wordpress_parent,
      name,
      slug,
      offset: acf.offsets,
      audio_src: "",
      avatar: "",
      ...others,
    };
  });

  return (
    <>
      {/* <pre style={{ color: "#ffffff" }}>
        {JSON.stringify(categories, null, 4)}
      </pre> */}
      <pre style={{ color: "#ffffff" }}>{JSON.stringify(books)}</pre>
    </>
  );
};

export const query = graphql`
  {
    allWordpressWpBooks(sort: { order: ASC, fields: acf___page_number }) {
      group(field: categories___id) {
        edges {
          node {
            categories {
              name
              slug
              wordpress_id
              parent_element {
                wordpress_id
                slug
              }
            }
            acf {
              arabic
              book_title
              english
              page_number
            }
          }
        }
      }
    }
    allWordpressCategory {
      nodes {
        wordpress_id
        slug
        wordpress_parent
        name
        description
        acf {
          offsets
        }
      }
    }
  }
`;

export default ComponentName;
