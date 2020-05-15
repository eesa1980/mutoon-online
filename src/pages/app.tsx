import { Container } from "@material-ui/core";
import { Router } from "@reach/router";
import * as React from "react";
import Admin from "../components/Admin";
import PrivateRoute from "../components/PrivateRoute";
import DefaultLayout from "../layouts/DefaultLayout";

const App = (props: any) => {
  return (
    <DefaultLayout>
      <Container maxWidth="sm">
        <Router>
          <PrivateRoute path="/app/admin" Component={Admin} />
          <PrivateRoute path="/app/user" Component={() => <div>user</div>} />
        </Router>
      </Container>
    </DefaultLayout>
  );
};
export default App;
