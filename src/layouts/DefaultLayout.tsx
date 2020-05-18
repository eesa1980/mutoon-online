import { Button, Hidden, useMediaQuery } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import teal from "@material-ui/core/colors/teal";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
  ThemeProvider,
} from "@material-ui/core/styles";
import debounce from "lodash-es/debounce";
import { User } from "netlify-identity-widget";
import "nprogress/nprogress.css";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Search from "../components/search/Search";
import SEO from "../components/Seo";
import { setUser } from "../redux/actions";
import {
  getUser,
  handleLogin,
  initAuth,
  isLoggedIn,
  logout,
} from "../service/auth";
import { compose } from "../util/compose";
import { stripTashkeel } from "../util/stringModifiers";
import "./index.css";

interface ILocation {
  pathname: string;
  title: string;
}

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location?: ILocation;
}

const Background = styled.div`
  background: ${({ theme }: any) => theme.palette.background.default};
  min-height: 100vh;
`;

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [searchVal, setSearchVal] = React.useState<string>("");
  const dispatch = useDispatch();

  const loggedIn = isLoggedIn();

  const onLoad = () => {
    initAuth();
    dispatch(setUser(getUser()));
  };

  useEffect(onLoad, []);

  const searchRef = React.createRef();

  useEffect(() => {
    if (!searchVal) {
      const searchEl: any = searchRef?.current;

      if (searchEl) {
        const el = searchEl.querySelector("#navSearch");
        el.value = "";
      }
    }
  }, [searchVal]);

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
      <Hidden xsUp>
        {!loggedIn ? (
          <Button
            onClick={() => {
              handleLogin((usr: User) => dispatch(setUser(usr)));
            }}
          >
            login
          </Button>
        ) : (
          <Button
            onClick={() => {
              logout((usr: User) => dispatch(setUser(usr)));
            }}
          >
            Logout
          </Button>
        )}
      </Hidden>
      <ThemeProvider theme={theme}>
        <SEO title={props.title} />
        <Navbar
          location={location}
          onSearch={(e: any) => debounced(e.target.value)}
          ref={searchRef}
        />
        {searchVal ? (
          <Search searchVal={searchVal} setSearchVal={setSearchVal} />
        ) : (
          props.children
        )}
      </ThemeProvider>
    </Background>
  );
};

export default DefaultLayout;
