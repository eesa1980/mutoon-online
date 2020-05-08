import { Container, Typography } from "@material-ui/core";
import { useStaticQuery } from "gatsby";
import { cloneDeep, groupBy, orderBy } from "lodash-es";
import escapeRegExp from "lodash-es/escapeRegExp";
import * as React from "react";
import { Fragment } from "react";
import styled from "styled-components";
import { AllWordpressCategory } from "../model";
import { AllWordpressWpBooks, BookEdge } from "../model/book";
import { AllWordpressWpMedia } from "../model/media";
import { compose } from "../util/compose";
import {
  addHighlighting,
  stripHtml,
  stripTashkeel,
} from "../util/stringModifiers";
import BookPage from "./BookPage";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface SearchPageProps {
  searchVal: string;
}

const Root = styled.div`
  margin-top: 10px;
`;

const Search: React.FC<SearchPageProps> = ({ searchVal = "" }) => {
  const data: {
    allWordpressCategory: AllWordpressCategory;
    allWordpressWpMedia: AllWordpressWpMedia;
    allWordpressWpBooks: AllWordpressWpBooks;
  } = useStaticQuery(searchQuery);

  if (!data) {
    return <></>;
  }

  const re = new RegExp(escapeRegExp(searchVal), "i");

  const isMatch = (result: any) => {
    const english = compose(stripHtml)(result.node.acf?.english);
    const arabic = compose(stripHtml, stripTashkeel)(result.node.acf?.arabic);

    return re.test(`${english} ${arabic}`) && searchVal;
  };

  const results: { title: string; edges: BookEdge[] }[] = React.useMemo(() => {
    if (!data) {
      return [{ title: "", edges: [] }];
    }

    const cloned = cloneDeep(data?.allWordpressWpBooks?.edges);
    const filtered = cloned.filter(isMatch);
    const ordered = orderBy(filtered, "node.acf.page_number", "asc");
    const grouped = groupBy(ordered, "node.acf.book_title");

    return Object.entries(grouped).map((book) => {
      const [title, edges] = book;

      return {
        title,
        edges: edges.map((edge) => {
          const { english, arabic } = edge.node.acf;

          if (searchVal && edge.node) {
            edge.node.acf.english = addHighlighting(english, searchVal);
            edge.node.acf.arabic = addHighlighting(
              stripTashkeel(arabic),
              searchVal
            );
          }

          return edge;
        }),
      };
    });
  }, [searchVal]);

  return (
    <Root>
      <Container maxWidth="sm">
        {results.length ? (
          results.map((item) => (
            <Fragment key={item.title}>
              <Typography component="h2" variant="h6" color="textSecondary">
                {item.title}
              </Typography>

              {item.edges.map((edge) => {
                const { acf } = edge.node;
                const pageNum = parseInt(acf.page_number, 10);

                return (
                  <Fragment key={`${acf.book_title}-${pageNum}`}>
                    {parseInt(acf.page_number, 10) > 0 ? (
                      <BookPage
                        index={pageNum}
                        arabic={acf?.arabic}
                        english={acf?.english}
                      />
                    ) : (
                      <Fragment />
                    )}
                  </Fragment>
                );
              })}
            </Fragment>
          ))
        ) : (
          <>
            {searchVal.length > 2 && (
              <Typography variant="h6" color="textSecondary">
                No results
              </Typography>
            )}
          </>
        )}
      </Container>
    </Root>
  );
};

const searchQuery = graphql`
  query SearchQuery {
    site {
      siteMetadata {
        title
      }
    }
    allWordpressWpBooks {
      edges {
        node {
          wordpress_id
          acf {
            arabic
            english
            book_title
            page_number
          }
          slug
          categories {
            slug
          }
        }
      }
    }
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
    allWordpressWpMedia(filter: { media_type: { eq: "image" } }) {
      nodes {
        media_type
        alt_text
        title
        categories {
          name
        }
        localFile {
          childImageSharp {
            id
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

export default Search;
