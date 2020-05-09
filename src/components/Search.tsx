import {
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  withTheme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useStaticQuery } from "gatsby";
import { cloneDeep, groupBy, orderBy } from "lodash-es";
import escapeRegExp from "lodash-es/escapeRegExp";
import * as React from "react";
import { Fragment, useMemo } from "react";
import styled from "styled-components";
import { AllWordpressCategory } from "../model";
import { AllWordpressWpBooks, BookEdge } from "../model/book";
import { AllWordpressWpMedia } from "../model/media";
import Hr from "../styled/Hr";
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

const Root = withTheme(styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)}px;
`);

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

  const results: {
    title: string;
    edges: BookEdge[];
    count: number;
  }[] = React.useMemo(() => {
    if (!data) {
      return [{ title: "", edges: [], count: 0 }];
    }

    const cloned = cloneDeep(data?.allWordpressWpBooks?.edges);
    const filtered = cloned.filter(isMatch);
    const ordered = orderBy(filtered, "node.acf.page_number", "asc");
    const grouped = groupBy(ordered, "node.acf.book_title");

    return Object.entries(grouped).map((book) => {
      const [title, edges] = book;
      let count = 0;

      return {
        title,
        edges: edges.map((edge) => {
          const { english, arabic } = edge.node.acf;

          const enRes = addHighlighting(english, searchVal);
          const arRes = addHighlighting(stripTashkeel(arabic), searchVal);

          if (searchVal && edge.node) {
            edge.node.acf.english = enRes.result;
            edge.node.acf.arabic = arRes.result;

            count += enRes.count || arRes.count;
          }

          return edge;
        }),
        count,
      };
    });
  }, [searchVal]);

  const counts = useMemo(
    () => ({
      results: results.reduce((a: any, b) => {
        return a + b.count;
      }, 0),
      pages: results.reduce((a: any, b) => {
        return a + b.edges.length;
      }, 0),
    }),
    [results]
  );

  const Content = ({ edges }: { edges: BookEdge[] }) => (
    <>
      {edges.map((edge) => {
        const { acf } = edge.node;

        return (
          <Fragment key={`${acf.book_title}-${acf.page_number}`}>
            {acf.page_number > 0 ? (
              <BookPage
                index={acf.page_number}
                arabic={acf?.arabic}
                english={acf?.english}
              />
            ) : (
              <Fragment />
            )}
          </Fragment>
        );
      })}
    </>
  );

  const Title = ({ title, count }: { title: string; count: number }) => (
    <Typography component="div" variant="h6" color="textSecondary">
      {title}:&nbsp;
      <Typography component="strong" variant="h6" color="textPrimary">
        {count}&nbsp;
      </Typography>
    </Typography>
  );

  return (
    <Root>
      <Container maxWidth="sm">
        <Typography
          component="h2"
          variant="h5"
          color="textSecondary"
          align="center"
        >
          <Typography component="strong" variant="h5" color="textPrimary">
            <p>
              <em>"{searchVal}"</em> - {counts.results}
              <Typography component="span" variant="h5" color="textSecondary">
                {" matches"}
              </Typography>
            </p>
          </Typography>
        </Typography>
        <Hr />
        {results.length ? (
          results.map((item, i) => (
            <Fragment key={i}>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Title title={item.title} count={item.count} />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ display: "block" }}>
                  <Content edges={item.edges} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Fragment>
          ))
        ) : (
          <>
            {searchVal.length > 2 && (
              <Typography variant="h6" color="textSecondary">
                <p>No results</p>
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
