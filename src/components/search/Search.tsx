import { Container, Typography, withTheme } from "@material-ui/core";
import { graphql, useStaticQuery } from "gatsby";
import { cloneDeep } from "lodash-es";
import * as React from "react";
import styled from "styled-components";
import { AllBook, BookNode } from "../../model/book";
import Hr from "../../styled/Hr";
import SearchAccordion from "../page-content/SearchAccordion";
import { ContentProcessor } from "./ContentProcessor";

interface SearchPageProps {
  searchVal: string;
  setSearchVal: React.Dispatch<React.SetStateAction<string>>;
}

interface Results {
  book: BookNode | undefined;
  count: number;
}

const Root = withTheme(styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)}px;
`);

const Search: React.FC<SearchPageProps> = ({
  searchVal = "",
  setSearchVal,
}) => {
  const data: {
    allBook: AllBook;
  } = useStaticQuery(searchQuery);

  if (!data) {
    return <></>;
  }

  const results: Results[] = React.useMemo(() => {
    if (!data) {
      return [{ book: undefined, count: 0 }];
    }

    const cp = ContentProcessor(searchVal);

    return cloneDeep(data.allBook.nodes).map(cp.processContent);
  }, [searchVal]);

  const total = results.reduce((i: number, res: Results) => i + res.count, 0);

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
              <em>"{searchVal}"</em> - {total}
              <Typography component="span" variant="h5" color="textSecondary">
                {" matches"}
              </Typography>
            </p>
          </Typography>
        </Typography>
        <Hr />
        {results.length ? (
          results
            .filter((res) => res.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((result, i) => (
              <SearchAccordion
                key={i}
                result={result}
                setSearchVal={setSearchVal}
              />
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
    allBook {
      nodes {
        category_id
        id
        slug
        title
        content {
          ar
          en
        }
      }
    }
  }
`;

export default Search;
