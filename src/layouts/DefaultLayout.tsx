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
          fontFamily: "Roboto",

          caption: {
            fontFamily: "Lateef",
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
            href="https://fonts.googleapis.com/css?family=Lateef|Roboto:400,700&display=swap&subset=arabic"
            rel="stylesheet"
          />
        </Helmet>
        {props.children}
      </ThemeProvider>
    </Background>
  );
};

export default DefaultLayout;
