export const updateHash = (hash: number, cb?: any) => {
  history.replaceState(
    "",
    document.title,
    window?.location.pathname + "?page-" + hash
  );

  if (cb) {
    cb(hash);
  }
};

export const getHashPage = () => {
  return parseInt(window?.location.search.split("page-")[1], 10);
};
