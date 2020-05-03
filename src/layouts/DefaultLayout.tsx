import { useMediaQuery } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
  ThemeProvider,
} from "@material-ui/core/styles";
import startCase from "lodash-es/startCase";
import * as React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import "./index.css";

const { description, keywords, name } = require("./../../package.json");

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location?: {
    pathname: string;
  };
}

const Background = styled.div`
  background: ${({ theme }: any) => theme.palette.background.default};
  min-height: 100vh;
  padding: 5px 0;
`;

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  let theme: Theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: teal,
          // type: prefersDarkMode ? "dark" : "light",
          type: "dark",
        },
        typography: {
          fontFamily: "Jost",

          caption: {
            fontFamily: "Scheherazade",
            fontSize: 35,
            direction: "rtl",
            fontWeight: 100,
          },
        },
      }),
    [prefersDarkMode]
  );

  theme = responsiveFontSizes(theme);

  return (
    <Background theme={theme}>
      <ThemeProvider theme={theme}>
        <Helmet
          title={startCase(name)}
          meta={[
            { name: "description", content: description },
            { name: "keywords", content: keywords },
          ]}
        >
          <link
            href="https://fonts.googleapis.com/css?family=Scheherazade&display=swap&subset=arabic"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Jost:400,500,700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        {props.children}
      </ThemeProvider>
    </Background>
  );
};

export default DefaultLayout;
