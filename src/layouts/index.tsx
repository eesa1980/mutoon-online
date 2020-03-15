import { Typography } from "@material-ui/core";
import blueGrey from "@material-ui/core/colors/blueGrey";
import teal from "@material-ui/core/colors/teal";
import NoSsr from "@material-ui/core/NoSsr";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
  ThemeProvider
} from "@material-ui/core/styles";
import Link from "gatsby-link";
import startCase from "lodash-es/startCase";
import * as React from "react";
import Helmet from "react-helmet";
import "typeface-roboto";
import "./index.css";

const { description, keywords, name } = require("./../../package.json");

let theme: Theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: blueGrey
  }
});

theme = responsiveFontSizes(theme);

const Header = () => (
  <div>
    <Typography variant="h4" component="h1">
      <Link to="/">HEADER</Link>
    </Typography>
  </div>
);

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location?: {
    pathname: string;
  };
}

const DefaultLayout: React.FC<DefaultLayoutProps> = props => {
  return (
    <NoSsr>
      <ThemeProvider theme={theme}>
        <div>
          <Helmet
            title={startCase(name)}
            meta={[
              { name: "description", content: description },
              { name: "keywords", content: keywords }
            ]}
          />
          <Header />
          {props.children}
        </div>
      </ThemeProvider>
    </NoSsr>
  );
};

export default DefaultLayout;
