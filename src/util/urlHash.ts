export const updateHash = (hash: number, cb?: any) => {
  history.replaceState(
    "",
    document.title,
    window?.location.pathname + window.location.search + "#page-" + hash
  );

  if (cb) {
    cb(hash);
  }
};

export const getHashPage = () => {
  return parseInt(window?.location.hash.split("page-")[1], 10);
};
