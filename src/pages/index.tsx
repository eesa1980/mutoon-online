import { Container, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "gatsby-link";
import * as React from "react";
import Select from "../components/Select";
import { books as booksDummy, categories as categoriesDummy } from "../dummy/";
import DefaultLayout from "../layouts/index";
import { Book, Category } from "../model";

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
  const [categoryVal, setCategoryVal] = React.useState<string>("");
  const [bookVal, setBookVal] = React.useState<string>("");

  const selectedCategory = React.useMemo(
    () => categoriesDummy.find(item => item._id === categoryVal),
    [categoryVal, bookVal]
  );

  const selectedBook = React.useMemo(
    () => booksDummy.find(item => item._id === bookVal),
    [categoryVal, bookVal]
  );

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1">
          <strong>{props.data.site.siteMetadata.title}</strong>
        </Typography>

        <Typography component="p">Select a book from below</Typography>

        <Select
          title={"Category"}
          handleChange={(value: string) => {
            setCategoryVal(value);
            setBookVal("");
          }}
          values={categoriesDummy.map((item: Category) => ({
            value: item._id,
            text: item.name
          }))}
        />

        {selectedCategory && (
          <>
            <Select
              title={"Book"}
              handleChange={setBookVal}
              values={booksDummy
                .filter((item: Book) => item.category_id === categoryVal)
                .map((item: Book) => ({
                  value: item._id,
                  text: item.name
                }))}
            />

            <br />

            <Typography component="p">
              {selectedBook && selectedBook.name}
            </Typography>
          </>
        )}

        <br />

        {selectedBook && (
          <Typography component="p">
            <strong>
              <Button
                to={`/books/${selectedBook.slug}/`}
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
