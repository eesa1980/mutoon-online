import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../redux/reducers";

const PrivateRoute = (props: any) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const user = useSelector((state: State) => state.user);

  if (user) {
    return <props.Component />;
  }

  return <h1>Please log in</h1>;
};

export default PrivateRoute;
