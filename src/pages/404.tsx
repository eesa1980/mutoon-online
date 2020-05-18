import { Button, Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { navigate } from "gatsby";
import * as React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import Hr from "../styled/Hr";

const NotFoundPage = () => (
  <DefaultLayout>
    <Container maxWidth="sm">
      <Typography
        component="h1"
        variant="h4"
        color="textPrimary"
        align="center"
      >
        <p>404 Error</p>
      </Typography>
      <Hr />
      <Typography
        component="h2"
        variant="h6"
        color="textSecondary"
        align="center"
      >
        <p>Page not found</p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          size="large"
        >
          Go to home page
        </Button>
      </Typography>
    </Container>
  </DefaultLayout>
);

export const pageQuery = graphql`
  query NotFoundQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;

export default NotFoundPage;
