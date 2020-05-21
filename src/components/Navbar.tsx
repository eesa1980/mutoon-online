import {
  ButtonBase,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeIcon from "@material-ui/icons/Home";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { graphql, navigate, useStaticQuery } from "gatsby";
import * as React from "react";
import { useDispatch } from "react-redux";
import { AllCategory, CategoryNode } from "../model/category";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    searchButton: {
      marginLeft: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    toolbar: theme.mixins.toolbar,
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "30ch",
        "&:focus": {
          width: "35ch",
        },
      },
    },
  })
);

const Navbar = React.forwardRef((props: any, searchRef) => {
  const [searchVal, setSearchVal] = React.useState<string>("");

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const data: { allCategory: AllCategory } = useStaticQuery(navbarQuery);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const grouped = React.useCallback(
    (parentId: string) => {
      const arr: CategoryNode[] = [];

      data.allCategory.group.forEach((group) =>
        group.nodes.forEach(
          (item) => item.parent_id === parentId && arr.push(item)
        )
      );

      return arr;
    },
    [data.allCategory.group]
  );

  const isActivePage = (slug: string) =>
    (typeof window === "object" && window.location.pathname.includes(slug)) ||
    false;

  const onChangeSearch = (e: any) => {
    setSearchVal(e.target.value);
  };

  const drawer = (
    <div>
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => navigate("/")}
          selected={typeof window === "object" && location.pathname === "/"}
        >
          <ListItemIcon>
            <HomeIcon />{" "}
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
      </List>
      <Divider />
      {data.allCategory.group[0].nodes.map((parent, i) => {
        return (
          parent.slug !== "unassigned" && (
            <List key={i}>
              <ListSubheader>{parent.name}</ListSubheader>
              {grouped(parent.id)?.map((item, ii) => (
                <ListItem
                  selected={isActivePage(item.slug)}
                  button
                  key={ii}
                  onClick={() => {
                    if (!isActivePage(item.slug)) {
                      navigate(item.slug);
                    }

                    setOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <LibraryBooksIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </List>
          )
        );
      })}
    </div>
  );

  return (
    <>
      <div></div>
      <AppBar position="sticky">
        <form onSubmit={(e) => props.onSubmitSearch(e, searchVal)}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              <ButtonBase
                component="a"
                onClick={() => navigate("/")}
                title="Mutoon Online"
              >
                Mutoon Online
              </ButtonBase>
            </Typography>
            <div className={classes.search}>
              <InputBase
                id="navSearch"
                ref={searchRef}
                type="search"
                autoFocus={false}
                fullWidth={true}
                onChange={onChangeSearch}
                placeholder="Search..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search book text" }}
              />
            </div>
            <IconButton
              type="submit"
              edge="start"
              className={classes.searchButton}
              color="inherit"
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </form>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
});

export const navbarQuery = graphql`
  query NavbarQuery {
    allCategory {
      group(field: parent_id) {
        nodes {
          name
          slug
          id
          parent_id
        }
      }
    }
  }
`;

export default Navbar;
