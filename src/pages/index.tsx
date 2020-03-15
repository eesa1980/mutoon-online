import { Container, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "gatsby-link";
import * as React from "react";
import ControlledOpenSelect from "../components/Select";
import { books } from "../dummy/";
import DefaultLayout from "../layouts/index";

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
  theme: any;
}

const Index: React.FC<IndexPageProps> = props => {
  const [book, setBook] = React.useState<string>("");

  const selectedBook = React.useMemo(
    () => books.find(item => item._id === book),
    [book]
  );

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1">
          <strong>{props.data.site.siteMetadata.title}</strong>
        </Typography>

        <Typography component="p">Select a book from below</Typography>

        <ControlledOpenSelect
          title={"Book"}
          handleChange={setBook}
          values={books.map(item => ({ value: item._id, text: item.title }))}
        />

        <br />

        <Typography component="p">
          {selectedBook && selectedBook.title}
        </Typography>

        <br />

        {selectedBook && (
          <Typography component="p">
            <strong>
              <Button
                to="/page-2/"
                variant="contained"
                color="primary"
                component={Link}
              >
                Start
              </Button>
            </strong>
          </Typography>
        )}
      </Container>
    </DefaultLayout>
  );
};

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default Index;
