import { useMediaQuery } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import teal from "@material-ui/core/colors/teal";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
  ThemeProvider,
} from "@material-ui/core/styles";
import debounce from "lodash-es/debounce";
import * as React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Search from "../components/search";
import SEO from "../components/Seo";
import { compose } from "../util/compose";
import { stripTashkeel } from "../util/stringModifiers";
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
  const [searchVal, setSearchVal] = React.useState<string>("");

  let theme: Theme = React.useMemo(
    () =>
      createMuiTheme({
        overrides: {},
        palette: {
          primary: teal,
          secondary: grey,
          // type: prefersDarkMode ? "dark" : "light",
          type: "dark",
        },
        typography: {
          fontFamily: "Roboto",

          caption: {
            fontFamily: "Lateef",
            fontSize: 30,
            direction: "rtl",
            fontWeight: 100,
          },
        },
      }),
    [prefersDarkMode]
  );

  theme = responsiveFontSizes(theme);

  const updateSearchVal = (val: string) => {
    if (val.length >= 3 && val.length > 0) {
      return compose(stripTashkeel, setSearchVal)(val);
    }

    setSearchVal("");
  };

  const debounced = debounce(updateSearchVal, 1000, {
    leading: false,
    trailing: true,
  });

  return (
    <Background theme={theme}>
      <ThemeProvider theme={theme}>
        <SEO />
        <Navbar onChange={(e: any) => debounced(e.target.value)} />
        {searchVal ? <Search searchVal={searchVal} /> : props.children}
      </ThemeProvider>
    </Background>
  );
};

export default DefaultLayout;
