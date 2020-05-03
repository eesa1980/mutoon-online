import { Container, Typography } from "@material-ui/core";
import * as React from "react";
import DefaultLayout from "../layouts/DefaultLayout";

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

const Index: React.FC<IndexPageProps> = (props) => {
  const [categoryVal, setCategoryVal] = React.useState<string>("");
  const [bookVal, setBookVal] = React.useState<string>("");

  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        <Typography variant="h1" component="h1" align="center">
          <strong>{props.data.site.siteMetadata.title}</strong>
        </Typography>
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
