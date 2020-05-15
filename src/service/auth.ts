import * as netlifyIdentity from "netlify-identity-widget";

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

export const isBrowser = () => typeof window !== "undefined";
export const initAuth = () => {
  if (isBrowser()) {
    window.netlifyIdentity = netlifyIdentity;
    // You must run this once before trying to interact with the widget
    netlifyIdentity.init();
  }
};

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gotrue.user")
    ? JSON.parse(window.localStorage.getItem("gotrue.user"))
    : {};

const setUser = (user: netlifyIdentity.User | {}) =>
  window.localStorage.setItem("gotrue.user", JSON.stringify(user));

export const handleLogin = (callback: any) => {
  if (isLoggedIn()) {
    callback(getUser());
  } else {
    netlifyIdentity.open();
    netlifyIdentity.on("login", (user) => {
      setUser(user);
      callback(user);
    });
  }
};

export const isLoggedIn = () => {
  if (!isBrowser()) return false;
  const user = netlifyIdentity.currentUser();
  return !!user;
};

export const logout = (callback: any) => {
  netlifyIdentity.logout();
  netlifyIdentity.on("logout", () => {
    setUser({});
    callback();
  });
};
