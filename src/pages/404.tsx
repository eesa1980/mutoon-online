import { Container } from "@material-ui/core";
import * as React from "react";
import DefaultLayout from "../layouts/DefaultLayout";

const NotFoundPage = () => (
  <DefaultLayout>
    <Container maxWidth="sm">
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Container>
  </DefaultLayout>
);

export default NotFoundPage;
