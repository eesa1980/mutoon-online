import {
  Container,
  FilledInput,
  FormControl,
  Typography,
} from "@material-ui/core";
import { cloneDeep } from "lodash-es";
import debounce from "lodash-es/debounce";
import escapeRegExp from "lodash-es/escapeRegExp";
import * as React from "react";
import { Fragment } from "react";
import styled from "styled-components";
import BookPage from "../components/BookPage";
import DefaultLayout from "../layouts/DefaultLayout";
import { AllWordpressCategory } from "../model";
import { AllWordpressWpBooks } from "../model/book";
import { AllWordpressWpMedia } from "../model/media";

function stripTashkeel(input: any) {
  return input.replace(/[\u0617-\u061A\u064B-\u0652]/g, "");
}

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface SearchPageProps {
  data: {
    allWordpressCategory: AllWordpressCategory;
    allWordpressWpMedia: AllWordpressWpMedia;
    allWordpressWpBooks: AllWordpressWpBooks;
  };
}

const SearchForm = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;

  label {
    text-align: center;
  }

  input {
    font-size: 30px;
    text-align: center;
  }
`;

const Wrapper = styled.div`
  height: calc(100vh - 74px);
  position: absolute;
  top: 74px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  overflow: auto;
  width: 100%;
`;

const Search: React.FC<SearchPageProps> = ({ data }) => {
  const [value, setValue] = React.useState<string>("");
  const [searchVal, setSearchVal] = React.useState<string>("");

  const re = new RegExp(escapeRegExp(searchVal), "i");
  const isMatch = (result: any) =>
    re.test(
      `${result.node.acf?.english.replace(
        /<(\w+)(.|[\r\n])*?>/,
        "<$1>"
      )} ${stripTashkeel(result.node.acf?.arabic).replace(
        /<(\w+)(.|[\r\n])*?>/,
        "<$1>"
      )}`
    ) && searchVal;

  const results = React.useMemo(
    () =>
      cloneDeep(data?.allWordpressWpBooks?.edges)
        .filter(isMatch)
        .map((edge) => {
          if (searchVal) {
            edge.node.acf.english = edge.node.acf.english.replace(
              new RegExp(escapeRegExp(searchVal), "gi"),
              `<mark>${searchVal}</mark>`
            );
            edge.node.acf.arabic = stripTashkeel(edge.node.acf.arabic).replace(
              new RegExp(escapeRegExp(searchVal), "gi"),
              `<mark>${searchVal}</mark>`
            );
          }
          return edge;
        }),
    [searchVal]
  );

  const set = (val: string) => {
    if (val.length >= 2 && val.length > 0) {
      return setSearchVal(stripTashkeel(val));
    }
    setSearchVal("");
  };

  const debounced = debounce(set, 1000, {
    leading: false,
    trailing: true,
  });

  return (
    <DefaultLayout>
      {/* <Navbar onChange={(e) => debounced(e.target.value)} /> */}

      <SearchForm>
        <FormControl variant="filled" color="primary" fullWidth={true}>
          <FilledInput
            autoFocus={true}
            fullWidth={true}
            id="my-input"
            aria-describedby="my-helper-text"
            onChange={(e) => debounced(e.target.value)}
            placeholder={`Search`}
          />
        </FormControl>
      </SearchForm>

      <Wrapper>
        <Container maxWidth="sm">
          {results.length ? (
            results.map((edge, i) => {
              return (
                <Fragment key={i}>
                  <BookPage
                    index={i}
                    arabic={edge.node.acf?.arabic}
                    english={edge.node.acf?.english}
                  />
                </Fragment>
              );
            })
          ) : (
            <Typography
              component="h1"
              variant="h6"
              color="textSecondary"
              align="center"
            >
              <p>Please type a search term</p>
            </Typography>
          )}
        </Container>
      </Wrapper>
    </DefaultLayout>
  );
};

export default Search;

export const pageQuery = graphql`
  query SearchQuery {
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
